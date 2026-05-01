const os = require('os');

const OWNER_UID = "61583721646897"; // 👉 এখানে তোমার Facebook UID বসাও
const OWNER_NAME = "TONMOY";

function formatDuration(seconds) {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor(seconds % (3600 * 24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);

    const timeFormat = [h, m, s]
        .map(t => t.toString().padStart(2, '0'))
        .join(':');

    return d > 0 ? `${d}d ${timeFormat}` : timeFormat;
}

module.exports = {
  config: {
    name: "uptime",
    version: "4.0",
    author: "TONMOY ☠",
    role: 0,
    category: "system"
  },

  onChat: async function({ message, event }) {
    if (event.body && event.body.toLowerCase() === "up") {

      const isOwner = event.senderID === OWNER_UID;

      const loading = await message.reply("⏳ SYSTEM BOOTING...");

      setTimeout(async () => {

        const uptime = formatDuration(process.uptime());

        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const usedMemory = totalMemory - freeMemory;

        const toGB = (b) => (b / (1024 * 1024 * 1024)).toFixed(2);

        const cpu = os.cpus()[0].model.replace(/\s+/g, ' ');
        const osType = os.type();

        const nodeRAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

        const msg = `
╔══════════════════════════════╗
   ☠ IM TONMOY BOT ☠
╚══════════════════════════════╝

[✓] STATUS   : ONLINE
[✓] UPTIME   : ${uptime}
[✓] OWNER    : ${OWNER_NAME} 👑
[✓] USER     : ${isOwner ? "OWNER ACCESS 🟢" : "GUEST MODE 🔴"}

╭─〔 BOT CORE 〕
│ ⚙ NodeJS : v${process.versions.node}
│ 💾 RAM    : ${nodeRAM} MB
╰──────────────

╭─〔 SERVER 〕
│ 🖥 OS   : ${osType} (${os.arch()})
│ ⚡ CPU  : ${cpu}
│ 🧠 RAM  : ${toGB(usedMemory)}GB / ${toGB(totalMemory)}GB
╰──────────────

>>> AUTHENTICATION ${isOwner ? "SUCCESS ✔" : "LIMITED ⚠"}
>>> ${isOwner ? "WELCOME BACK, MASTER 😈" : "ACCESS RESTRICTED 🚫"}
`;

        message.edit(msg, loading.messageID);

      }, 1500);
    }
  }
};
