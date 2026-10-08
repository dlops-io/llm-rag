#!/bin/bash

echo "Container is running!!!"
echo "Architecture: $(uname -m)"
echo "Environment ready! Virtual environment activated."
echo "Python version: $(python --version)"
echo "UV version: $(uv --version)"

# Activate virtual environment
echo "Activating virtual environment..."
source /home/app/.venv/bin/activate

# Run the api/service.py file with the instantiated app FastAPI
uvicorn_server() {
    uvicorn api.service:app --host 0.0.0.0 --port 9000 --log-level debug --reload --reload-dir api/ "$@"
}

uvicorn_server_production() {
    uv run uvicorn api.service:app --host 0.0.0.0 --port 9000 --lifespan on
}

export -f uvicorn_server
export -f uvicorn_server_production

echo -en "\033[92m
The following commands are available:
    uvicorn_server
        Run the Uvicorn Server
\033[0m
"

if [ "${DEV}" = 1 ]; then
    # Development mode: Keep shell open
    exec /bin/bash
else
    # Production mode: Run server in the foreground
    uvicorn_server_production
fi