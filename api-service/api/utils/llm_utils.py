import os
from typing import Dict, Any, List, Optional
from fastapi import HTTPException
import base64
import io
from PIL import Image
from pathlib import Path
import traceback

# Vertex AI
from google import genai
from google.genai import types
from google.genai.types import Content, Part, GenerationConfig, ToolConfig
from google.genai import errors
from google.genai.chats import Chat

# Setup
GCP_PROJECT = os.environ["GCP_PROJECT"]
GCP_LOCATION = "global"
EMBEDDING_MODEL = "text-embedding-004"
EMBEDDING_DIMENSION = 256
GENERATIVE_MODEL = "gemini-3.5-flash"

#############################################################################
#                       Initialize the LLM Client                           #
llm_client = genai.Client(vertexai=True, project=GCP_PROJECT, location=GCP_LOCATION)
#############################################################################

# Initialize the GenerativeModel with specific system instructions
SYSTEM_INSTRUCTION = """
You are an AI assistant specialized in cheese knowledge.

When answering a query:
1. Demonstrate expertise in cheese, including aspects like:
  - Production methods and techniques
  - Flavor profiles and characteristics
  - Aging processes and requirements
  - Regional varieties and traditions
  - Pairing recommendations
  - Storage and handling best practices
2. Always maintain a professional and knowledgeable tone, befitting a cheese expert.

Your goal is to provide accurate, helpful information about cheese for each query.
"""

# Initialize chat sessions
chat_sessions: Dict[str, Chat] = {}


def create_chat_session(past_history=None) -> Chat:
    """Create a new chat session with the model"""
    # Create a new chat session
    return llm_client.chats.create(model=GENERATIVE_MODEL, history=past_history)


def generate_chat_response(chat_session: Chat, message: Dict) -> str:
    """
    Generate a response using the chat session to maintain history.
    Handles both text and image inputs.

    Args:
        chat_session: The Vertex AI chat session
        message: Dict containing 'content' (text) and optionally 'image' (base64 string)

    Returns:
        str: The model's response
    """

    try:
        # Initialize parts list for the message
        message_parts = []

        # Process image if present
        if message.get("image"):
            try:
                # Extract the actual base64 data and mime type
                base64_string = message.get("image")
                if "," in base64_string:
                    header, base64_data = base64_string.split(",", 1)
                    mime_type = header.split(":")[1].split(";")[0]
                else:
                    base64_data = base64_string
                    mime_type = "image/jpeg"  # default to JPEG if no header

                # Decode base64 to bytes
                image_bytes = base64.b64decode(base64_data)

                # Create an image Part using FileData
                image_part = Part.from_bytes(data=image_bytes, mime_type=mime_type)
                message_parts.append(image_part)

                # Add text content if present
                if message.get("content"):
                    message_parts.append(message["content"])
                else:
                    message_parts.append(
                        "Name the cheese in the image, no descriptions needed"
                    )

            except ValueError as e:
                print(f"Error processing image: {str(e)}")
                raise HTTPException(
                    status_code=400, detail=f"Image processing failed: {str(e)}"
                )
        elif message.get("image_path"):
            # Read the image file
            image_path = os.path.join("chat-history", "llm", message.get("image_path"))
            with Path(image_path).open("rb") as f:
                image_bytes = f.read()

            # Determine MIME type based on file extension
            mime_type = {
                ".jpg": "image/jpeg",
                ".jpeg": "image/jpeg",
                ".png": "image/png",
                ".gif": "image/gif",
            }.get(Path(image_path).suffix.lower(), "image/jpeg")

            # Create an image Part using FileData
            image_part = Part.from_bytes(data=image_bytes, mime_type=mime_type)
            message_parts.append(image_part)

            # Add text content if present
            if message.get("content"):
                message_parts.append(message["content"])
            else:
                message_parts.append(
                    "Name the cheese in the image, no descriptions needed"
                )
        else:
            # Add text content if present
            if message.get("content"):
                message_parts.append(message["content"])

        if not message_parts:
            raise ValueError("Message must contain either text content or image")

        # Send message with all parts to the model
        response = chat_session.send_message(message_parts)

        return response.text

    except Exception as e:
        print(f"Error generating response: {str(e)}")
        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail=f"Failed to generate response: {str(e)}"
        )


def rebuild_chat_session(chat_history: List[Dict]) -> Chat:
    """Rebuild a chat session with complete context"""

    formatted_history = []
    for message in chat_history:
        if message["role"] == "user":
            formatted_history.append(
                types.UserContent(parts=[types.Part.from_text(text=message["content"])])
            )
        elif message["role"] == "assistant":
            formatted_history.append(
                types.ModelContent(
                    parts=[types.Part.from_text(text=message["content"])]
                )
            )

    new_session = create_chat_session(formatted_history)
    return new_session
