const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "info",
    author: "TONMOY",
    role: 0,
    shortDescription: "Hacker Owner Info",
    longDescription: "Pro hacker style owner info with video",
    category: "admin",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    try {

      // 👑 OWNER INFO
      const ownerInfo = {
        name: "TIGER MATE TONMOY",
        gender: "MALE",
        nick: "LEADER VAI ⚡",
        power: "ROOT ACCESS",
        status: "ONLINE 🟢"
      };

      // 🎥 VIDEO LINK
      const videoURL = "https://files.catbox.moe/w4x1lt.mp4";

      const tmpFolder = path.join(__dirname, "tmp");
      if (!fs.existsSync(tmpFolder)) {
        fs.mkdirSync(tmpFolder, { recursive: true });
      }

      const videoPath = path.join(tmpFolder, "owner.mp4");

      // ⬇️ DOWNLOAD VIDEO
      const response = await axios({
        url: videoURL,
        method: "GET",
        responseType: "stream",
        maxRedirects: 5
      });

      const writer = fs.createWriteStream(videoPath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      // 💀 HACKER STYLE TEXT
      const msg = `
╔════════════════════╗
   ☠ SYSTEM ACCESS ☠
╚════════════════════╝

> INITIALIZING...
> CONNECTING TO SERVER...
> ACCESS GRANTED ✅

╭━━━[ USER PROFILE ]━━━╮
👤 NAME   : ${ownerInfo.name}
⚧ GENDER : ${ownerInfo.gender}
🏷 NICK   : ${ownerInfo.nick}
╰━━━━━━━━━━━━━━━━━━━━╯

╭━━━[ SYSTEM DATA ]━━━╮
⚡ POWER  : ${ownerInfo.power}
📡 STATUS : ${ownerInfo.status}
🧠 MODE   : HACKER PRO
╰━━━━━━━━━━━━━━━━━━━━╯

> SCANNING NETWORK ████████ 100%
> BYPASSING FIREWALL 🔓
> ROOT ACCESS GRANTED 👑

☣ WARNING: UNAUTHORIZED ACCESS DENIED
🚀 BOT CONTROLLED BY TONMOY
`;

      // 📤 SEND MESSAGE WITH VIDEO
      await api.sendMessage(
        {
          body: msg,
          attachment: fs.createReadStream(videoPath)
        },
        event.threadID,
        () => {
          if (fs.existsSync(videoPath)) {
            fs.unlinkSync(videoPath);
          }
        }
      );

    } catch (err) {
      console.error(err);
      return api.sendMessage(
        "❌ SYSTEM ERROR! VIDEO LOAD FAILED.",
        event.threadID
      );
    }
  }
};
