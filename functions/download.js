const ytdlp = require('yt-dlp-exec');
const fs = require('fs');
const path = require('path');

// 📁 Ruta de cookies
const cookiesPath = path.join(__dirname, '../cookies.txt');

// 🎵 DESCARGAR AUDIO (MP3)
async function downloadAudio(url) {
  const file = `audio_${Date.now()}.mp3`;

  try {
    await ytdlp(url, {
      extractAudio: true,
      audioFormat: "mp3",
      output: file,
      cookies: cookiesPath
    });

    return file;

  } catch (error) {
    console.error("❌ Error descargando audio:", error);
    throw new Error("Error al descargar audio");
  }
}

// 🎬 DESCARGAR VIDEO (MP4)
async function downloadVideo(url) {
  const file = `video_${Date.now()}.mp4`;

  try {
    await ytdlp(url, {
      format: "mp4",
      output: file,
      cookies: cookiesPath
    });

    return file;

  } catch (error) {
    console.error("❌ Error descargando video:", error);
    throw new Error("Error al descargar video");
  }
}

module.exports = {
  downloadAudio,
  downloadVideo
};