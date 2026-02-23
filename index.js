const { Telegraf } = require("telegraf");
const { searchYoutube } = require("./functions/youtube");
const { downloadMP3 } = require("./functions/download");
const fs = require("fs");
const path = require("path");
// 🔥 PEGA AQUÍ TU TOKEN CORRECTO
const bot = new Telegraf("8071971772:AAFIRQGK0NXM00ARH2QNue3zM4TikPqLcKE");
bot.start((ctx) => {
  ctx.reply("🎵 Envíame el nombre de una canción y te la descargo en MP3.");
});
bot.on("text", async (ctx) => {
  try {
    const query = ctx.message.text;
    console.log("Buscando:", query);

    // 1️⃣ Buscar en YouTube
    const url = await searchYoutube(query);

    if (!url) {
      return ctx.reply("❌ No encontré esa canción.");
    }

    console.log("URL encontrada:", url);

    // 2️⃣ Descargar MP3
    const filePath = await downloadMP3(url);

    console.log("Archivo descargado:", filePath);

    // 3️⃣ Enviar audio
    await ctx.replyWithAudio({
      source: filePath
    });

    // 4️⃣ Borrar archivo después de enviarlo
    fs.unlinkSync(filePath);

  } catch (error) {
    console.error("ERROR REAL:", error);
    ctx.reply("⚠️ Ocurrió un error al descargar la canción.");
  }
});

bot.launch()
  .then(() => console.log("🤖 Bot iniciado correctamente"))
  .catch((err) => console.error("Error al iniciar bot:", err));