#!/bin/bash

echo "Menjalankan ML Service..."

cd /app/deployment/ml-service
uvicorn app:app --host 0.0.0.0 --port 8000 &

echo "Menjalankan Backend..."

cd /app/deployment/backend
npm start