#!/bin/bash

# exit immediately if a command exits with a non-zero status
set -e

# Set variables
export GCP_PROJECT="ac215-project" # CHANGE TO YOUR PROJECT ID
export GOOGLE_APPLICATION_CREDENTIALS="/secrets/llm-service-account.json"
export IMAGE_NAME="llm-rag-cli"

# Create the network if we don't have it yet
#docker network inspect llm-rag-network >/dev/null 2>&1 || docker network create llm-rag-network

# Build the image based on the Dockerfile
#docker build -t $IMAGE_NAME .

# Run all containers
docker compose run --rm $IMAGE_NAME
