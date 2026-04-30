const axios = require('axios');
const fs = require('fs');
const path = require('path');

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

      // 🎥 VIDEO LINK (change anytime)
      const videoURL = "https://o.uguu.se/oOuYUuHJ.mp4";

      const tmpFolder = path.join(__dirname, "tmp");
      if (!fs.existsSync(tmpFolder)) fs.mkdirSync(tmpFolder);

      const videoPath = path.join(tmpFolder, "owner.mp4");

      // ⬇️ DOWNLOAD VIDEO
      const stream = await axios({
        url: videoURL,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(videoPath);
      stream.data.pipe(writer);

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

      // 📤 SEND
      await api.sendMessage({
        body: msg,
        attachment: fs.createReadStream(videoPath)
      }, event.threadID, () => {
        fs.unlinkSync(videoPath);
      });

    } catch (err) {
      console.error(err);
      return api.sendMessage("❌ SYSTEM ERROR!", event.threadID);
    }
  }
};
