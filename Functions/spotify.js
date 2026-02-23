const axios = require("axios");

const CLIENT_ID = "a46f7c49c3cc49a1bb971390c3436626";
const CLIENT_SECRET = "e027dc1c5b354949b7fd92ffdd601092";

async function getAccessToken() {
    const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        "grant_type=client_credentials",
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + Buffer.from(
                    CLIENT_ID + ":" + CLIENT_SECRET
                ).toString("base64")
            }
        }
    );

    return response.data.access_token;
}

async function getSpotifyInfo(url) {
    try {
        const trackId = url.split("/track/")[1].split("?")[0];

        const token = await getAccessToken();

        const response = await axios.get(
            `https://api.spotify.com/v1/tracks/${trackId}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = response.data;

        return {
            title: data.name,
            artist: data.artists.map(a => a.name).join(", ")
        };

    } catch (error) {
        console.log("ERROR SPOTIFY:", error.response?.data || error.message);
        throw error;
    }
}

module.exports = { getSpotifyInfo };