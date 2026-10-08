#!/bin/bash

echo "Container is running!!!"
echo "Architecture: $(uname -m)"

echo "Environment ready! Virtual environment activated."
echo "Python version: $(python --version)"
echo "UV version: $(uv --version)"

# Activate virtual environment
echo "Activating virtual environment..."
source /.venv/bin/activate

# Keep a shell open
exec /bin/bash