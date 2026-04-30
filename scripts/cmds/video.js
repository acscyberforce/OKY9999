const axios = require('axios');
const yts = require("yt-search");

const baseApiUrl = async () => {
    const base = await axios.get(
        `https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`
    );
    return base.data.api;
};

(async () => {
    global.apis = {
        diptoApi: await baseApiUrl()
    };
})();

async function getStreamFromURL(url, pathName) {
    const response = await axios.get(url, {
        responseType: "stream"
    });
    response.data.path = pathName;
    return response.data;
}

global.utils = {
    ...global.utils,
    getStreamFromURL: global.utils.getStreamFromURL || getStreamFromURL
};

function getVideoID(url) {
    const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
    const match = url.match(checkurl);
    return match ? match[1] : null;
}

const config = {
    name: "video",
    author: "Tonmoy",
    version: "2.0.0",
    role: 0,
    description: "Hacker Style Video Downloader",
    category: "media",
    cooldowns: 5
};

async function onStart({ api, args, event }) {
    let loadingMsg;
    try {
        let videoID;
        const url = args[0];

        // 🔍 Hacker loading message
        loadingMsg = await api.sendMessage(
            `\`\`\`
[ SYSTEM ] Initializing...
[ SEARCH ] Finding target...
\`\`\``,
            event.threadID
        );

        if (url && (url.includes("youtube.com") || url.includes("youtu.be"))) {
            videoID = getVideoID(url);
            if (!videoID) {
                return api.sendMessage("❌ Invalid YouTube URL", event.threadID);
            }
        } else {
            const songName = args.join(' ');
            const r = await yts(songName);
            const videos = r.videos.slice(0, 20);
            const random = videos[Math.floor(Math.random() * videos.length)];
            videoID = random.videoId;
        }

        const { data: { title, quality, downloadLink } } =
            await axios.get(`${global.apis.diptoApi}/ytDl3?link=${videoID}&format=mp4`);

        if (loadingMsg) api.unsendMessage(loadingMsg.messageID);

        const shortLink = (await axios.get(
            `https://tinyurl.com/api-create.php?url=${encodeURIComponent(downloadLink)}`
        )).data;

        // 💻 Hacker Terminal Style Message
        const msg = `
\`\`\`
┌──[ TONMOY@SYSTEM ]──[ VIDEO FETCHED ]
│
├─🎬 Title    : ${title}
├─📀 Quality  : ${quality}
│
├─👑 Owner    : Tonmoy
├─⚡ Work     : BD CYBER COMMUNITY
│
├─📥 Download : ${shortLink}
│
└─[ STATUS ] SUCCESSFULLY EXECUTED ✔
\`\`\`
`;

        await api.sendMessage({
            body: msg,
            attachment: await global.utils.getStreamFromURL(downloadLink, title + ".mp4")
        }, event.threadID);

    } catch (err) {
        if (loadingMsg) api.unsendMessage(loadingMsg.messageID);
        api.sendMessage(`❌ Error: ${err.message}`, event.threadID);
    }
}

module.exports = {
    config,
    onStart,
    run: onStart
};
