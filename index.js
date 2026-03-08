const { Telegraf, Markup } = require("telegraf");
const { searchYoutube } = require("./funciones/youtube");
const { downloadMp3 } = require("./funciones/download");
const fs = require("fs");

const bot = new Telegraf("8071971772:AAGHq45P6pbLJwLVGWLTFQLKrVIdeZHNPAo");

const results = {};

bot.start((ctx) => {
  ctx.reply("🎵 Hola!\n\nEnvíame el nombre de una canción.");
});

bot.on("text", async (ctx) => {

  const query = ctx.message.text;

  if (query.startsWith("/")) return;

  await ctx.reply("🔎 Buscando canciones...");

  const videos = await searchYoutube(query);

  if (!videos.length) {
    return ctx.reply("❌ No encontré resultados.");
  }

  results[ctx.from.id] = videos;

  const buttons = videos.map((v, i) =>
    [Markup.button.callback(`${i + 1}. ${v.title}`, `song_${i}`)]
  );

  ctx.reply(
    "🎵 Selecciona una canción:",
    Markup.inlineKeyboard(buttons)
  );

});

bot.action(/song_(\d+)/, async (ctx) => {

  const index = ctx.match[1];
  const userResults = results[ctx.from.id];

  if (!userResults) return;

  const video = userResults[index];

  await ctx.replyWithPhoto(video.thumbnail, {
    caption: `🎵 ${video.title}\n⬇️ Descargando audio...`
  });

  try {

    const filePath = await downloadMp3(video.url);

    await ctx.replyWithAudio({
      source: filePath
    });

    fs.unlinkSync(filePath);

  } catch (error) {

    console.log(error);
    ctx.reply("❌ Error descargando la canción.");

  }

});

bot.launch().then(() => {
  console.log("Bot iniciado correctamente");
}).catch(console.error);

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));