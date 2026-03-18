const fs = require('fs');
const play = require('play-dl');

// 🎵 AUDIO
async function downloadAudio(url) {
  const file = "audio.mp3";

  const stream = await play.stream(url, { quality: 2 });
  const writeStream = fs.createWriteStream(file);

  return new Promise((resolve, reject) => {
    stream.stream.pipe(writeStream);

    writeStream.on('finish', () => resolve(file));
    writeStream.on('error', reject);
  });
}

// 🎬 VIDEO (básico por ahora)
async function downloadVideo(url) {
  throw new Error("Video no soportado aún en versión Railway");
}

module.exports = {
  downloadAudio,
  downloadVideo
};