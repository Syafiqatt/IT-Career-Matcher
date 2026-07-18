FROM node:22-bookworm

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv

WORKDIR /app

COPY . .

# Backend
WORKDIR /app/backend
RUN npm install

# ML
WORKDIR /app/ml-service
RUN pip3 install --break-system-packages -r requirements.txt

WORKDIR /app

RUN chmod +x start.sh

EXPOSE 3000
EXPOSE 8000

CMD ["./start.sh"]
