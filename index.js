const { Telegraf } = require("telegraf");
const searchYoutube = require("./functions/youtube");
const fs = require("fs");
const path = require("path");
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => {
  ctx.reply("🎵 Envíame el nombre de una canción y te la descargo en MP3.");
});
bot.on("text", async (ctx) => {
  try {
    const query = ctx.message.text;
    console.log("Buscando:", query);
 const url = await searchYoutube(query);
if (!url) {
return ctx.reply("❌ No encontré esa canción.");
}
 console.log("URL encontrada:", url);
 ctx.reply(`✅ Encontré la canción:\n${url}`);
  } catch (error) {
    console.log("ERROR GENERAL:", error.message);
    ctx.reply("⚠️ Ocurrió un error al buscar la canción.");
  }
});
bot.launch()
  .then(() => console.log("🤖 Bot iniciado correctamente"))
  .catch((err) => console.error("Error al iniciar bot:", err));
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot activo 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor web activo"));
