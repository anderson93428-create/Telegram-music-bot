const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");

function downloadMP3(url) {
  return new Promise((resolve, reject) => {
    const output = path.join(__dirname, "../audio.mp3");

    const stream = ytdl(url, {
      filter: "audioonly",
      quality: "highestaudio"
    });

    stream.pipe(fs.createWriteStream(output))
      .on("finish", () => resolve(output))
      .on("error", reject);
  });
}

function downloadVideo(url) {
  return new Promise((resolve, reject) => {
    const output = path.join(__dirname, "../video.mp4");

    const stream = ytdl(url, {
      quality: "highestvideo"
    });

    stream.pipe(fs.createWriteStream(output))
      .on("finish", () => resolve(output))
      .on("error", reject);
  });
}

module.exports = { downloadMP3, downloadVideo };
