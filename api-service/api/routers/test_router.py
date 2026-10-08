import os
from fastapi import APIRouter, Query, Body, HTTPException
from fastapi.responses import FileResponse
from typing import Dict, Any, Optional
import glob
import json
import traceback
import chromadb

# Define Router
router = APIRouter()

CHROMADB_HOST = os.environ["CHROMADB_HOST"]
CHROMADB_PORT = os.environ["CHROMADB_PORT"]

@router.get("/test-chroma")
async def test_chroma():
    try:

        # Connect to chroma DB
        client = chromadb.HttpClient(host=CHROMADB_HOST, port=CHROMADB_PORT)
        collections = client.list_collections()
        collections = [col.name for col in collections]
        print(collections)

        return {
            "CHROMADB_HOST": CHROMADB_HOST,
            "CHROMADB_PORT": CHROMADB_PORT,
            "collections": collections
        }

    except Exception as e:
        print(f"Error generating response: {str(e)}")
        traceback.print_exc()
        return {
            "CHROMADB_HOST": CHROMADB_HOST,
            "CHROMADB_PORT": CHROMADB_PORT,
            "exception": "HTTPException",
            "detail": str(e)
        }