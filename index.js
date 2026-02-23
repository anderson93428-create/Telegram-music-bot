const { Telegraf } = require("telegraf");
const searchYoutube = require("./functions/youtube");
const { downloadMP3, downloadVideo } = require("./functions/download");
const fs = require("fs");
const express = require("express");

const bot = new Telegraf(process.env.BOT_TOKEN);

// 🔹 Inicio
bot.start((ctx) => {
  ctx.reply("🎵 Envíame el nombre de una canción.");
});

// 🔹 Buscar canción
bot.on("text", async (ctx) => {
  try {
    const query = ctx.message.text;
    console.log("Buscando:", query);

    await ctx.reply("🔍 Buscando...");

    const url = await searchYoutube(query);

    if (!url) {
      return ctx.reply("❌ No encontré esa canción.");
    }

    await ctx.reply("¿Qué deseas descargar?", {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🎵 MP3", callback_data: `mp3|${url}` },
            { text: "🎬 Video", callback_data: `video|${url}` }
          ]
        ]
      }
    });

  } catch (error) {
    console.log("ERROR GENERAL:", error);
    ctx.reply("⚠️ Ocurrió un error.");
  }
});

// 🔹 Manejar botones
bot.on("callback_query", async (ctx) => {
  try {
    const [type, url] = ctx.callbackQuery.data.split("|");

    await ctx.answerCbQuery();
    await ctx.reply("⬇️ Descargando...");

    if (type === "mp3") {
      const filePath = await downloadMP3(url);
      await ctx.replyWithAudio({ source: filePath });
      fs.unlinkSync(filePath);
    }

    if (type === "video") {
      const filePath = await downloadVideo(url);
      await ctx.replyWithVideo({ source: filePath });
      fs.unlinkSync(filePath);
    }

  } catch (error) {
    console.log("ERROR DESCARGA:", error);
    ctx.reply("❌ Error al descargar.");
  }
});

bot.launch()
  .then(() => console.log("🤖 Bot iniciado correctamente"))
  .catch((err) => console.error("Error al iniciar bot:", err));

// 🔥 Servidor Express para Render
const app = express();
app.get("/", (req, res) => {
  res.send("Bot activo 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor web activo en puerto " + PORT));
