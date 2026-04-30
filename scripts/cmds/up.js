const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const os = require("os");
const path = require("path");

module.exports = {
  config: {
    name: "uptime",
    aliases: ["up", "live"],
    version: "4.0",
    author: "TONMOY",
    role: 0,
    usePrefix: true,
    shortDescription: {
      en: "Live system status"
    },
    category: "system"
  },

  async onChat({ event, message, commandName }) {
    const prefix = global.GoatBot.config.prefix || "/";
    const body = event.body?.trim() || "";

    if (
      !body.startsWith(prefix + commandName) &&
      !this.config.aliases.some(a => body.startsWith(prefix + a))
    ) return;

    const imgPath = path.join(__dirname, "live_status.png");

    try {
      const pingMsg = await message.reply("⚡ Checking system...");

      const start = Date.now();
      await new Promise(r => setTimeout(r, 80));
      const ping = Date.now() - start;

      // Uptime
      const uptime = process.uptime();
      const d = Math.floor(uptime / 86400);
      const h = Math.floor((uptime % 86400) / 3600);
      const m = Math.floor((uptime % 3600) / 60);
      const s = Math.floor(uptime % 60);
      const upTime = `${d}D ${h}H ${m}M ${s}S`;

      // RAM
      const totalMem = os.totalmem() / 1024 / 1024;
      const freeMem = os.freemem() / 1024 / 1024;
      const usedMem = totalMem - freeMem;

      // CPU
      const cpuModel = os.cpus()[0].model;
      const cpuCores = os.cpus().length;

      // Canvas
      const canvas = createCanvas(1000, 550);
      const ctx = canvas.getContext("2d");

      const bg = await loadImage("https://i.imgur.com/3ZQ3Z6G.jpeg");
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

      // Dark overlay
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Title
      ctx.fillStyle = "#00ffcc";
      ctx.font = "bold 48px Arial";
      ctx.fillText("LIVE SYSTEM STATUS", 50, 90);

      ctx.fillStyle = "#ffffff";
      ctx.font = "30px Arial";

      ctx.fillText(`⏳ Uptime : ${upTime}`, 50, 170);
      ctx.fillText(`⚡ Ping   : ${ping} ms`, 50, 220);

      ctx.fillText(`💾 RAM Used : ${usedMem.toFixed(0)} MB`, 50, 280);
      ctx.fillText(`🧠 CPU Core : ${cpuCores}`, 50, 330);

      ctx.fillText(`🖥️ Platform : ${os.platform()}`, 50, 380);
      ctx.fillText(`⚙️ NodeJS : ${process.version}`, 50, 430);

      ctx.fillText(`👑 Owner : TONMOY`, 50, 490);

      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(imgPath, buffer);

      await message.unsend(pingMsg.messageID);

      await message.reply({
        body: `
╭──『 🔥 LIVE SYSTEM 』──╮
│ ⏳ Uptime : ${upTime}
│ ⚡ Ping   : ${ping} ms
│ 💾 RAM    : ${usedMem.toFixed(0)}MB / ${totalMem.toFixed(0)}MB
│ 🧠 CPU    : ${cpuCores} Cores
│ 🖥️ OS     : ${os.platform()}
│ ⚙️ Node   : ${process.version}
│ 👑 Owner  : TONMOY
╰────────────────────╯
🚀 System Running Perfectly
        `,
        attachment: fs.createReadStream(imgPath)
      });

    } catch (err) {
      console.error(err);
      message.reply("❌ System error!");
    } finally {
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
  }
};
