#!/bin/bash
set -e

echo "Masuk ke ML Service..."
cd /app/ml-service

if [ ! -f "career_recommender_model.joblib" ]; then
    echo "Downloading ML model..."
    python3 -m gdown "https://drive.google.com/uc?id=1oxJa6tXs8rjAAOy-fzyS4cyNKchggvwl" \
        -O career_recommender_model.joblib
fi

echo "Isi folder ml-service:"
ls -lh

echo "Cek file model:"
ls -lh career_recommender_model.joblib

echo "Menjalankan ML Service..."
python3 -m uvicorn app:app --host 127.0.0.1 --port 8000 &
ML_PID=$!

echo "Menunggu ML Service siap..."
for i in $(seq 1 30); do
    if python3 - <<'PY'
import urllib.request
try:
    urllib.request.urlopen("http://127.0.0.1:8000/health", timeout=2)
    print("ML health OK")
    exit(0)
except Exception:
    exit(1)
PY
    then
        echo "ML Service siap."
        break
    fi

    if ! kill -0 "$ML_PID" 2>/dev/null; then
        echo "ML Service mati sebelum siap."
        wait "$ML_PID"
        exit 1
    fi

    echo "Menunggu ML... $i"
    sleep 2
done

echo "Menjalankan Backend..."
cd /app/backend
export ML_SERVICE_URL="http://127.0.0.1:8000"

npm start &
BACKEND_PID=$!

echo "ML PID: $ML_PID"
echo "Backend PID: $BACKEND_PID"

wait -n "$ML_PID" "$BACKEND_PID"
EXIT_CODE=$?

echo "Salah satu proses mati. Exit code: $EXIT_CODE"
exit "$EXIT_CODE"