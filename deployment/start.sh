#!/bin/bash
set -e

echo "Masuk ke ML Service..."
cd /app/ml-service

if [ ! -f "career_recommender_model.joblib" ]; then
    echo "Downloading ML model..."
    python3 -m gdown "https://drive.google.com/uc?id=1oxJa6tXs8rjAAOy-fzyS4cyNKchggvwl" \
        -O career_recommender_model.joblib
fi

echo "Menjalankan ML Service..."
python3 -m uvicorn app:app --host 0.0.0.0 --port 8000 

echo "Isi folder ml-service:"
ls -lh

echo "Cek file model:"
ls -lh career_recommender_model.joblib

echo "Menjalankan Backend..."
cd /app/backend
npm start
