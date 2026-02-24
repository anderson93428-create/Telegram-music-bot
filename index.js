// Importaciones y configuración inicial
const { Telegraf } = require("telegraf");
const searchYoutube = require("./functions/youtube");
const { downloadMP3, downloadVideo } = require("./functions/download");
const fs = require("fs");
const express = require("express");

console.log("TOKEN:", process.env.BOT_TOKEN);
const bot = new Telegraf(process.env.BOT_TOKEN);

// 🔹 Comando /start
bot.start((ctx) => {
  ctx.reply("🎵 Envíame el nombre de una canción.");
});

// 🔹 Manejo de mensajes de texto (reemplaza tu bloque anterior)
bot.on("text", async (ctx) => {
  try {
    const query = ctx.message.text;
    console.log("Buscando:", query);
    await ctx.reply("🔍 Buscando...");

    const url = await searchYoutube(query);
    if (!url) {
      return ctx.reply("❌ No encontré esa canción.");
    }

    await ctx.reply("🎵 Preparando la descarga...");

    // Intentar descargar el MP3 de manera segura
    try {
      const filePath = await downloadMP3(url); // o downloadVideo(url)
      await ctx.replyWithAudio({ source: fs.createReadStream(filePath) });
      fs.unlinkSync(filePath); // borrar archivo después de enviar
    } catch (err) {
      console.error("Error descargando canción:", err.message);
      await ctx.reply("❌ No se pudo descargar la canción. Intenta otra.");
    }

  } catch (err) {
    console.error("Error general:", err);
    ctx.reply("❌ Ocurrió un error, intenta de nuevo.");
  }
});

// 🔹 Inicio del bot
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
