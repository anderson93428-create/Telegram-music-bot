const fs = require('fs');
const play = require('play-dl');
const { exec } = require('child_process');

// 🔊 AUDIO
async function downloadAudio(url) {

  const file = "audio.mp3";

  const stream = await play.stream(url, { quality: 2 });

  const writeStream = fs.createWriteStream(file);

  return new Promise((resolve, reject) => {

    stream.stream.pipe(writeStream);

    writeStream.on('finish', () => {
      resolve(file);
    });

    writeStream.on('error', reject);

  });

}

// 🎬 VIDEO
async function downloadVideo(url) {

  const file = "video.mp4";

  return new Promise((resolve, reject) => {

    exec(`ffmpeg -i "${url}" -c copy ${file}`, (error) => {
      if (error) return reject(error);
      resolve(file);
    });

  });

}

module.exports = {
  downloadAudio,
  downloadVideo
};