FROM node:20

WORKDIR /app

COPY package*.json ./

# instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    ffmpeg \
    yt-dlp \
    python3 \
    python3-pip \
    build-essential
RUN yt-dlp -U
# crear alias python -> python3
RUN ln -s /usr/bin/python3 /usr/bin/python

# instalar dependencias node
RUN npm install

COPY . .

CMD ["node", "index.js"]