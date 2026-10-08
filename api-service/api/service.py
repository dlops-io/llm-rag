import os
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from api.routers import newsletter, podcast

from api.routers import llm_chat, llm_cnn_chat
from api.routers import llm_rag_chat, llm_agent_chat

# from api.routers import test_router

# Set root_path based on environment
ROOT_PATH = os.getenv("ROOT_PATH", "")

# Setup FastAPI app
api_app = FastAPI(title="API Server", description="API Server", version="v1")

# Enable CORSMiddleware
api_app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routes
@api_app.get("/")
async def get_index():
    return {"message": "Welcome to AC215"}


@api_app.get("/status")
async def get_api_status():
    return {"version": "3.0"}


# Additional routers here
api_app.include_router(newsletter.router, prefix="/newsletters")
api_app.include_router(podcast.router, prefix="/podcasts")
api_app.include_router(llm_chat.router, prefix="/llm")
api_app.include_router(llm_cnn_chat.router, prefix="/llm-cnn")
api_app.include_router(llm_rag_chat.router, prefix="/llm-rag")
api_app.include_router(llm_agent_chat.router, prefix="/llm-agent")
# app.include_router(test_router.router, prefix="/test")

# Mount your API under ROOT-PATH to match the Ingress rule
app = FastAPI(title="API Server", description="API Server", version="v1")
app.mount(ROOT_PATH, api_app)
