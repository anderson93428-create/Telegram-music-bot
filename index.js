require('dotenv').config();

const { Telegraf } = require('telegraf');
const ytdlp = require('yt-dlp-exec');
const fs = require('fs');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply("👋 Bienvenido.\n\nEnvíame un link de YouTube y podrás descargar:\n🎵 Música (MP3)\n🎬 Video (MP4)");
});

bot.on('text', async (ctx) => {

  const url = ctx.message.text;

  if (url.includes("youtube.com") || url.includes("youtu.be")) {

    await ctx.reply("¿Qué deseas descargar?", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🎵 Descargar Música (MP3)", callback_data: "mp3|" + url }],
          [{ text: "🎬 Descargar Video (MP4)", callback_data: "mp4|" + url }]
        ]
      }
    });

  } else {

    ctx.reply("⚠️ Envíame un link válido de YouTube.");

  }

});

bot.on("callback_query", async (ctx) => {

  const data = ctx.callbackQuery.data;
  const [type, url] = data.split("|");

  try {

    if (type === "mp3") {

      await ctx.reply("🎵 Descargando música...");

      const file = "audio.mp3";

      await ytdlp(url, {
        extractAudio: true,
        audioFormat: "mp3",
        output: file
      });

      await ctx.replyWithAudio({ source: file });

      fs.unlinkSync(file);

    }

    if (type === "mp4") {

      await ctx.reply("🎬 Descargando video...");

      const file = "video.mp4";

      await ytdlp(url, {
        format: "mp4",
        output: file
      });

      await ctx.replyWithVideo({ source: file });

      fs.unlinkSync(file);

    }

  } catch (error) {

    console.log(error);
    ctx.reply("❌ Ocurrió un error descargando el archivo.");

  }

});

bot.launch();

console.log("🤖 Bot funcionando...");