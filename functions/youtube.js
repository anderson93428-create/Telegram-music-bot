const yts = require("yt-search");

async function searchYoutube(query) {
  const result = await yts(query);
  if (!result.videos.length) return null;

  return result.videos[0].url;
}

module.exports = searchYoutube;
