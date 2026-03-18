require('dotenv').config({ quiet: true });

const { Telegraf } = require('telegraf');
const fs = require('fs');
const path = require('path');

const { downloadAudio, downloadVideo } = require('./functions/download');

const bot = new Telegraf(process.env.BOT_TOKEN);

// 🔥 CREAR cookies.txt DESDE VARIABLES (RAILWAY)
if (process.env.COOKIES) {
  fs.writeFileSync(path.join(__dirname, 'cookies.txt'), process.env.COOKIES);
  console.log("🍪 Cookies cargadas correctamente");
}

// 🚀 COMANDO START
bot.start((ctx) => {
  ctx.reply(
    "👋 Bienvenido al Bot PRO\n\n" +
    "📩 Envíame un link de YouTube\n\n" +
    "🎵 Descargar Música (MP3)\n" +
    "🎬 Descargar Video (MP4)"
  );
});

// 📩 MENSAJE DE TEXTO
bot.on('text', async (ctx) => {
  const url = ctx.message.text;

  if (url.includes("youtube.com") || url.includes("youtu.be")) {

    await ctx.reply("¿Qué deseas descargar?", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🎵 MP3", callback_data: `mp3|${url}` }],
          [{ text: "🎬 MP4", callback_data: `mp4|${url}` }]
        ]
      }
    });

  } else {
    ctx.reply("⚠️ Envíame un link válido de YouTube.");
  }
});

// 🎯 BOTONES
bot.on("callback_query", async (ctx) => {
  const data = ctx.callbackQuery.data;
  const [type, url] = data.split("|");

  try {

    if (type === "mp3") {
      await ctx.reply("🎵 Descargando música...");

      const file = await downloadAudio(url);

      await ctx.replyWithAudio({ source: file });

      fs.unlinkSync(file);
    }

    if (type === "mp4") {
      await ctx.reply("🎬 Descargando video...");

      const file = await downloadVideo(url);

      await ctx.replyWithVideo({ source: file });

      fs.unlinkSync(file);
    }

  } catch (error) {
    console.error(error);
    ctx.reply("❌ Error al descargar. Intenta con otro video.");
  }
});

// 🔥 EVITAR ERROR 409
bot.launch({
  dropPendingUpdates: true
});

// 🛑 CIERRE LIMPIO
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log("🤖 Bot PRO funcionando...");