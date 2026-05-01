const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "acs",
    version: "3.0.0",
    author: "Tonmoy X Gok",
    countDown: 2,
    role: 0,
    shortDescription: "Cyber Terminal Media",
    longDescription: "Advanced hacker-style auto media system",
    category: "cyber"
  },

  onStart: async function () {},

  onChat: async function ({ event, message }) {
    if (!event.body) return;

    const trigger = event.body.toLowerCase().trim();
    if (trigger !== "acs") return;

    const mediaLinks = [
      "https://files.catbox.moe/ovi0y8.mp4",
      "https://files.catbox.moe/56c13m.mp4",
      "https://files.catbox.moe/jcdom0.mp4",
      "https://files.catbox.moe/di7uim.mp4",
      "https://files.catbox.moe/7inhxp.mp4",
      "https://files.catbox.moe/o5exmv.mp4",
      "https://files.catbox.moe/isirrv.mp4",
      "https://files.catbox.moe/948ocd.mp4",
      "https://files.catbox.moe/58pxep.mp4",
      "https://files.catbox.moe/1jjx82.mp4"
    ];

    const hackerMessages = [
      "⚠ SYSTEM BREACH INITIATED...",
      "💀 FIREWALL BYPASSED...",
      "🧠 NEURAL ACCESS GRANTED...",
      "🔥 ROOT ACCESS ACTIVE...",
      "📡 SIGNAL HIJACKED...",
      "👁 TARGET LOCKED...",
      "🛑 SECURITY OVERRIDE SUCCESS..."
    ];

    const uiStyles = [
      (msg) => `┌──[ 𝗔𝗖𝗦 / 𝗖𝗬𝗕𝗘𝗥 𝗧𝗘𝗥𝗠𝗜𝗡𝗔𝗟 ]──┐
│ ${msg}
│
│ ⚡ STATUS: ONLINE
│ 👨‍💻 USER: UNKNOWN
│ 👑 SYSTEM: TONMOY CORE
└────────────────────────┘`,

      (msg) => `╔═════[ 𝗔𝗖𝗦 𝗦𝗬𝗦𝗧𝗘𝗠 ]═════╗
║ ${msg}
║
║ ⚡ ACTIVE
║ 👁 MONITORING...
║ 👑 TONMOY BOSS MODE
╚══════════════════════╝`,

      (msg) => `╭━━━ 𝗖𝗬𝗕𝗘𝗥 𝗟𝗔𝗕 ━━━╮
┃ ${msg}
┃
┃ ⚡ ONLINE
┃ 🧬 DATA FLOW ACTIVE
┃ 👑 TONMOY CORE SYSTEM
╰━━━━━━━━━━━━━━━━━━╯`
    ];

    const randomLink = mediaLinks[Math.floor(Math.random() * mediaLinks.length)];
    const randomText = hackerMessages[Math.floor(Math.random() * hackerMessages.length)];
    const style = uiStyles[Math.floor(Math.random() * uiStyles.length)](randomText);

    const fileName = `acs_${Date.now()}.mp4`;
    const filePath = path.join(__dirname, fileName);

    try {
      const response = await axios.get(randomLink, { responseType: "arraybuffer" });
      await fs.writeFile(filePath, Buffer.from(response.data));

      await message.reply({
        body: style,
        attachment: fs.createReadStream(filePath)
      });

    } catch (err) {
      console.error(err);
      await message.reply("╔═══[ ERROR ]═══╗\n║ MEDIA LOAD FAILED ❌\n╚══════════════╝");
    } finally {
      fs.unlink(filePath, () => {});
    }
  }
};
