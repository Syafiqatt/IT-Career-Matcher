#!/bin/bash
set -e

echo "Starting ML Service..."

cd /app/ml-service
python3 -m uvicorn app:app --host 0.0.0.0 --port 8000 &

echo "Starting Backend..."

cd /app/backend
npm start