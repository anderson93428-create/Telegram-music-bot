const { exec } = require("child_process");
const path = require("path");

function downloadMP3(url) {
  return new Promise((resolve, reject) => {
    const output = path.join(__dirname, "../audio.mp3");

    exec(`yt-dlp -x --audio-format mp3 -o "${output}" ${url}`, (error) => {
      if (error) return reject(error);
      resolve(output);
    });
  });
}

function downloadVideo(url) {
  return new Promise((resolve, reject) => {
    const output = path.join(__dirname, "../video.mp4");

    exec(`yt-dlp -f mp4 -o "${output}" ${url}`, (error) => {
      if (error) return reject(error);
      resolve(output);
    });
  });
}

module.exports = { downloadMP3, downloadVideo };
