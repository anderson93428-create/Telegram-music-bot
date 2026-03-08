FROM node:20

WORKDIR /app

COPY package*.json ./

# instalar dependencias del sistema
RUN apt-get update && apt-get install -y ffmpeg yt-dlp python3

# instalar dependencias node
RUN npm install

COPY . .

CMD ["node", "index.js"]