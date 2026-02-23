const { execFile } = require("child_process");
const path = require("path");

async function downloadMP3(url) {
    return new Promise((resolve, reject) => {
        const output = path.join(__dirname, `../song_${Date.now()}.mp3`);
        const ytdlpPath = path.join(__dirname, "../yt-dlp.exe");

        execFile(
            ytdlpPath,
            [
                "-x",
                "--audio-format",
                "mp3",
                "--ffmpeg-location",
                path.join(__dirname, ".."),
                "-o",
                output,
                url
            ],
            (error, stdout, stderr) => {
                if (error) {
                    console.log("YTDLP ERROR:", stderr);
                    reject(error);
                } else {
                    resolve(output);
                }
            }
        );
    });
}

module.exports = { downloadMP3 };