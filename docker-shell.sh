#!/bin/bash

# exit immediately if a command exits with a non-zero status
set -e

# Set variables
export GCP_PROJECT="ac215-project" # CHANGE TO YOUR PROJECT ID
export GOOGLE_APPLICATION_CREDENTIALS="/secrets/llm-service-account.json"
export IMAGE_NAME="llm-rag-cli"



# Run all containers
docker compose run --rm $IMAGE_NAME
