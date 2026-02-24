const { Telegraf } = require("telegraf");
const searchYoutube = require("./functions/youtube");
const express = require("express");

const bot = new Telegraf(process.env.BOT_TOKEN);

// 🔹 Comando start
bot.start((ctx) => {
  ctx.reply("🎵 Envíame el nombre de una canción.");
});

// 🔹 Cuando el usuario envía texto
bot.on("text", async (ctx) => {
  try {
    const query = ctx.message.text;

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

// 🔹 Manejo de botones
bot.on("callback_query", async (ctx) => {
  try {
    const [type, url] = ctx.callbackQuery.data.split("|");

    await ctx.answerCbQuery();

    if (type === "mp3") {
      const link = `https://api.vevioz.com/api/button/mp3?url=${encodeURIComponent(url)}`;
      await ctx.reply(`🎵 Descarga tu MP3 aquí:\n${link}`);
    }

    if (type === "video") {
      const link = `https://api.vevioz.com/api/button/videos?url=${encodeURIComponent(url)}`;
      await ctx.reply(`🎬 Descarga tu video aquí:\n${link}`);
    }

  } catch (error) {
    console.log("ERROR BOTÓN:", error);
    ctx.reply("❌ Error al generar enlace.");
  }
});

// 🔹 Iniciar bot
bot.launch()
  .then(() => console.log("🤖 Bot iniciado correctamente"))
  .catch((err) => console.error("Error al iniciar bot:", err));

// 🔹 Servidor Express (necesario para Render Web Service)
const app = express();
app.get("/", (req, res) => {
  res.send("Bot activo 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor web en puerto " + PORT));
