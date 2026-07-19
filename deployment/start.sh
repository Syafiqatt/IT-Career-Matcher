#!/bin/bash
set -e

echo "Masuk ke ML Service..."
cd /app/ml-service

# Download model jika belum ada
if [ ! -f "career_recommender_model.pkl" ]; then
    echo "Downloading ML model..."
    python3 -m gdown --id 1oxJa6tXs8rjAAOy-fzyS4cyNKchggvwl -O career_recommender_model.pkl
fi

echo "Menjalankan ML Service..."
python3 -m uvicorn app:app --host 0.0.0.0 --port 8000 &

echo "Menjalankan Backend..."
cd /app/backend
npm start
