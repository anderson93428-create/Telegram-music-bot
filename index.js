const { Telegraf } = require("telegraf");
const { downloadMP3, downloadVideo } = require("./functions/download");
const searchYoutube = require("./functions/youtube");
const fs = require("fs");
const express = require("express");

if (!process.env.BOT_TOKEN) {
  throw new Error("❌ El token del bot no está definido en BOT_TOKEN");
}

const bot = new Telegraf(process.env.BOT_TOKEN);

// ---------------------
// Comando /start
// ---------------------
bot.start((ctx) => {
  ctx.reply("🎵 Envíame el nombre de una canción o pegame un link de YouTube.");
});

// ---------------------
// Descarga segura
// ---------------------
async function safeSendAudio(ctx, url) {
  try {
    ctx.reply("⬇️ Descargando audio...");
    const filePath = await downloadMP3(url);
    await ctx.replyWithAudio({ source: fs.createReadStream(filePath) });
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error("Error audio:", err);
    ctx.reply("❌ No pude descargar el audio. Intenta otra canción.");
  }
}

async function safeSendVideo(ctx, url) {
  try {
    ctx.reply("⬇️ Descargando video...");
    const filePath = await downloadVideo(url);
    await ctx.replyWithVideo({ source: fs.createReadStream(filePath) });
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error("Error video:", err);
    ctx.reply("❌ No pude descargar el video.");
  }
}

// ---------------------
// Mensajes de texto
// ---------------------
bot.on("text", async (ctx) => {
  const query = ctx.message.text.trim();
  if (!query) return;

  await ctx.reply("🔍 Buscando...");

  try {
    const url = await searchYoutube(query);
    if (!url) {
      return ctx.reply("❌ No encontré resultados para: " + query);
    }

    await ctx.reply("¿Qué quieres descargar?", {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🎵 MP3", callback_data: `mp3|${url}` },
            { text: "🎬 Video", callback_data: `video|${url}` },
          ],
        ],
      },
    });
  } catch (err) {
    console.error("Error en búsqueda:", err);
    ctx.reply("⚠️ Error al buscar. Intenta de nuevo.");
  }
});

// ---------------------
// Botones (callback)
// ---------------------
bot.on("callback_query", async (ctx) => {
  await ctx.answerCbQuery();

  const [type, url] = ctx.callbackQuery.data.split("|");
  if (!url) return ctx.reply("❌ Link inválido.");

  if (type === "mp3") {
    await safeSendAudio(ctx, url);
  } else if (type === "video") {
    await safeSendVideo(ctx, url);
  } else {
    ctx.reply("❓ Opción no reconocida.");
  }
});

// ---------------------
// Lanzar bot + servidor para Render
// ---------------------
bot.launch()
  .then(() => console.log("🤖 Bot iniciado correctamente"))
  .catch((err) => console.error("Error al iniciar bot:", err));

const app = express();
app.get("/", (req, res) => res.send("Bot activo 🚀"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor web en puerto ${PORT}`));

// Para graceful shutdown (buena práctica en Render)
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
