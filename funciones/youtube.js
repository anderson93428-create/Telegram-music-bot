const ytdlp = require('yt-dlp-exec');
const fs = require('fs');

async function downloadVideo(url) {
  const file = "video.mp4";

  await ytdlp(url, {
    format: "mp4",
    output: file
  });

  return file;
}

module.exports = { downloadVideo };