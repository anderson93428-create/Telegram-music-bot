// Importaciones y configuración inicial
const { Telegraf } = require("telegraf");
const searchYoutube = require("./functions/youtube");
const { downloadMP3 } = require("./functions/download");
const fs = require("fs");

console.log("TOKEN:", process.env.BOT_TOKEN);

if (!process.env.BOT_TOKEN) {
  throw new Error("❌ El token del bot no está definido en BOT_TOKEN");
}

// Inicializar bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// 🔹 Comando /start
bot.start((ctx) => {
  ctx.reply("🎵 Envíame el nombre de una canción.");
});

// 🔹 Función segura para descargar y enviar MP3
async function safeDownload(ctx, url) {
  try {
    const filePath = await downloadMP3(url);
    await ctx.replyWithAudio({ source: fs.createReadStream(filePath) });
    fs.unlinkSync(filePath); // borrar archivo temporal
  } catch (err) {
    console.error("Error descargando canción:", err.message);
    await ctx.reply("❌ No se pudo descargar la canción. Intenta otra.");
  }
}

// 🔹 Manejo de mensajes de texto
bot.on("text", async (ctx) => {
  try {
    const query = ctx.message.text;
    console.log("Buscando:", query);
    await ctx.reply("🔍 Buscando...");

    const url = await searchYoutube(query);
    if (!url) return ctx.reply("❌ No encontré esa canción.");

    await ctx.reply("🎵 Preparando la descarga...");
    await safeDownload(ctx, url);
  } catch (err) {
    console.error("Error general:", err);
    ctx.reply("❌ Ocurrió un error, intenta de nuevo.");
  }
});

// 🔹 Lanzar bot con polling (Render lo mantiene vivo)
bot.launch()
  .then(() => console.log("🤖 Bot iniciado correctamente"))
  .catch((err) => console.error("Error al iniciar bot:", err));

// 🔥 Servidor Express opcional solo para Render (monitorización)
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot activo 🚀");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Servidor web activo en puerto " + PORT));
