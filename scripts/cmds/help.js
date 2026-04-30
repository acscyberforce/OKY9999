const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "help",
    version: "3.0",
    author: "TONMOY",
    role: 0,
    description: "Stylish image help menu",
    category: "info"
  },

  onStart: async function ({ message, event }) {

    const prefix = global.GoatBot.config.prefix;

    const canvas = createCanvas(900, 500);
    const ctx = canvas.getContext("2d");

    // 🎨 Background
    ctx.fillStyle = "#0b0b0b";
    ctx.fillRect(0, 0, 900, 500);

    // 💚 Glow line
    ctx.strokeStyle = "rgba(0,255,120,0.3)";
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, 860, 460);

    // 🔥 Title
    ctx.fillStyle = "#00ff9c";
    ctx.font = "bold 40px Sans";
    ctx.textAlign = "center";
    ctx.fillText("BOT COMMAND MENU", 450, 80);

    // ⚙ Owner
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px Sans";
    ctx.fillText("Owner: TONMOY", 450, 120);

    // 📜 Commands
    const cmds = [
      `${prefix}help - Show menu`,
      `${prefix}prefix - Prefix info`,
      `${prefix}owner - Owner info`,
      `${prefix}info - Bot info`,
      `${prefix}ban - Ban user`,
      `${prefix}kick - Kick user`
    ];

    ctx.textAlign = "left";
    ctx.fillStyle = "#cccccc";
    ctx.font = "22px Sans";

    let y = 180;
    cmds.forEach(cmd => {
      ctx.fillText("➤ " + cmd, 80, y);
      y += 40;
    });

    // ⚡ Footer
    ctx.fillStyle = "#00ff9c";
    ctx.font = "18px Sans";
    ctx.fillText("STATUS: ONLINE ⚡ | MODE: HACKER PRO", 450, 460);

    // 💾 Save image
    const filePath = path.join(__dirname, "help.png");
    fs.writeFileSync(filePath, canvas.toBuffer());

    // 📤 Send image
    return message.reply({
      body: "⚡ Help Menu Generated",
      attachment: fs.createReadStream(filePath)
    }, () => fs.unlinkSync(filePath));
  }
};
