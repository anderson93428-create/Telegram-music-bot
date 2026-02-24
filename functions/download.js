const ytDlp = require("yt-dlp-exec");
const path = require("path");

async function downloadMP3(url) {
  const output = path.join(__dirname, "../audio.mp3");

  await ytDlp(url, {
    extractAudio: true,
    audioFormat: "mp3",
    output
  });

  return output;
}

async function downloadVideo(url) {
  const output = path.join(__dirname, "../video.mp4");

  await ytDlp(url, {
    format: "mp4",
    output
  });

  return output;
}

module.exports = { downloadMP3, downloadVideo };
