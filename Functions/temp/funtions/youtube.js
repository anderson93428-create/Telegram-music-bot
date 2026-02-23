const yts = require("yt-search");

async function searchYoutube(query) {
  try {
    const result = await yts(query);

    if (!result || !result.videos || result.videos.length === 0) {
      throw new Error("No se encontraron resultados en YouTube");
    }

    const video = result.videos[0];

    if (!video.url) {
      throw new Error("El video no tiene URL válida");
    }

    return video.url;

  } catch (error) {
    console.log("ERROR YOUTUBE:", error.message);
    throw error;
  }
}

module.exports = searchYoutube;
