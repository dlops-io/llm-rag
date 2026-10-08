import os
from typing import Dict, Any, List, Optional
from fastapi import HTTPException
import base64
import io
import json
import requests
import zipfile
import numpy as np
from PIL import Image
from pathlib import Path
from tempfile import TemporaryDirectory
import traceback
import tensorflow as tf
from tensorflow.python.keras import backend as K
from tensorflow.keras.models import Model

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

# CNN Model details
AUTOTUNE = tf.data.experimental.AUTOTUNE
local_experiments_path = "/persistent/experiments"
best_model = None
best_model_id = None
cnn_model = None
data_details = None
image_width = 224
image_height = 224
num_channels = 3


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
    response = chat_session.send_message(message["content"])
    return response.text


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
        elif message["role"] == "cnn":
            formatted_history.append(
                types.UserContent(
                    parts=[
                        types.Part.from_text(
                            text=f"We have already identified the image of a cheese as {message['results']['prediction_label']}"
                        )
                    ]
                )
            )
    new_session = create_chat_session(formatted_history)
    return new_session


def load_cnn_model():
    print("Loading CNN Model...")
    global cnn_model, data_details

    os.makedirs(local_experiments_path, exist_ok=True)

    experiment_name = "experiment_1760994796"
    best_model_path = os.path.join(
        local_experiments_path, experiment_name, "mobilenetv2_train_base_True.keras"
    )
    print("best_model_path:", best_model_path)
    if not os.path.exists(best_model_path):
        # Download from Github for easy access (This needs to be from you GCS bucket or from storage location after training)
        # https://github.com/dlops-io/models/releases/download/v4.0/experiment_1760994796.zip
        packet_url = "https://github.com/dlops-io/models/releases/download/v4.0/experiment_1760994796.zip"
        packet_file = os.path.basename(packet_url)
        with requests.get(packet_url, stream=True, headers=None) as r:
            r.raise_for_status()
            with open(os.path.join(local_experiments_path, packet_file), "wb") as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
        with zipfile.ZipFile(
            os.path.join(local_experiments_path, packet_file)
        ) as zfile:
            zfile.extractall(local_experiments_path)

    cnn_model = tf.keras.models.load_model(best_model_path)
    print(cnn_model.summary())

    data_details_path = os.path.join(
        local_experiments_path, experiment_name, "data_details.json"
    )

    # Load data details
    with open(data_details_path, "r") as json_file:
        data_details = json.load(json_file)


# Load the CNN Model
load_cnn_model()


def load_preprocess_image_from_path(image_path):
    print("Image", image_path)

    image_width = 224
    image_height = 224
    num_channels = 3

    # Prepare the data
    def load_image(path):
        image = tf.io.read_file(path)
        image = tf.image.decode_jpeg(image, channels=num_channels)
        image = tf.image.resize(image, [image_height, image_width])
        return image

    # Normalize pixels
    def normalize(image):
        image = image / 255
        return image

    test_data = tf.data.Dataset.from_tensor_slices(([image_path]))
    test_data = test_data.map(load_image, num_parallel_calls=AUTOTUNE)
    test_data = test_data.map(normalize, num_parallel_calls=AUTOTUNE)
    test_data = test_data.repeat(1).batch(1)

    return test_data


def make_prediction(image_path):

    # Load & preprocess
    test_data = load_preprocess_image_from_path(image_path)

    # Make prediction
    prediction = cnn_model.predict(test_data)
    idx = prediction.argmax(axis=1)[0]
    prediction_label = data_details["index2label"][str(idx)]

    if cnn_model.layers[-1].activation.__name__ != "softmax":
        prediction = tf.nn.softmax(prediction).numpy()
        print(prediction)

    return {
        "input_image_shape": str(test_data.element_spec.shape),
        "prediction_shape": prediction.shape,
        "prediction_label": prediction_label,
        "prediction": prediction.tolist(),
        "accuracy": round(float(np.max(prediction)) * 100, 2),
    }
