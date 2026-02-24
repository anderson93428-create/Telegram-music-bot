const { Telegraf } = require("telegraf");
const ytdl = require("@distube/ytdl-core");
const ytSearch = require("yt-search");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const fs = require("fs");
const path = require("path");
const express = require("express");

const bot = new Telegraf(process.env.BOT_TOKEN);

ffmpeg.setFfmpegPath(ffmpegPath);

bot.start((ctx) => {
  ctx.reply("🎵 Envíame el nombre de una canción.");
});

bot.on("text", async (ctx) => {
  try {
    const query = ctx.message.text;

    await ctx.reply("🔍 Buscando...");

    const result = await ytSearch(query);
    const video = result.videos[0];

    if (!video) {
      return ctx.reply("❌ No encontré esa canción.");
    }

    await ctx.reply(`🎵 Encontrado:\n${video.title}\n\n¿Descargar?`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🎵 Descargar MP3", callback_data: `mp3|${video.url}` }
          ]
        ]
      }
    });

  } catch (err) {
    console.log(err);
    ctx.reply("⚠️ Error buscando la canción.");
  }
});

bot.on("callback_query", async (ctx) => {
  try {
    const [type, url] = ctx.callbackQuery.data.split("|");
    await ctx.answerCbQuery();
    await ctx.reply("⬇️ Descargando...");

    const fileName = `audio_${Date.now()}.mp3`;
    const filePath = path.join(__dirname, fileName);

    const stream = ytdl(url, {
      quality: "highestaudio",
      filter: "audioonly",
      requestOptions: {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      }
    });

    await new Promise((resolve, reject) => {
      ffmpeg(stream)
        .audioBitrate(128)
        .save(filePath)
        .on("end", resolve)
        .on("error", reject);
    });

    const stats = fs.statSync(filePath);
    const fileSizeMB = stats.size / (1024 * 1024);

    if (fileSizeMB > 49) {
      fs.unlinkSync(filePath);
      return ctx.reply("❌ Archivo demasiado grande para Telegram.");
    }

    await ctx.replyWithAudio({ source: filePath });

    fs.unlinkSync(filePath);

  } catch (error) {
    console.log("ERROR DESCARGA:", error);
    ctx.reply("❌ Error al descargar.");
  }
});

bot.launch();

const app = express();
app.get("/", (req, res) => {
  res.send("Bot activo 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);