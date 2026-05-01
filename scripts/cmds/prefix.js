const fs = require("fs-extra");
const moment = require("moment-timezone");
const { utils } = global;

module.exports = {
  config: {
    name: "prefix",
    version: "4.0",
    author: "TONMOY (Optimized by ChatGPT)",
    countDown: 5,
    role: 0,
    description: "Show and change bot prefix safely",
    category: "⚙️ configuration"
  },

  onStart: async function ({ message, role, args, commandName, event, threadsData }) {
    if (!args[0]) return message.SyntaxError();

    // RESET PREFIX
    if (args[0] === "reset") {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply(`✅ Reset done!\nDefault prefix: ${global.GoatBot.config.prefix}`);
    }

    const newPrefix = args[0];
    const setGlobal = args[1] === "-g";

    // ADMIN CHECK
    if (setGlobal && role < 2) {
      return message.reply("⛔ Only bot admins can change global prefix!");
    }

    return message.reply(
      setGlobal
        ? "⚙️ React to confirm GLOBAL prefix change."
        : "⚙️ React to confirm CHAT prefix change.",
      (err, info) => {
        global.GoatBot.onReaction.set(info.messageID, {
          commandName,
          author: event.senderID,
          newPrefix,
          setGlobal,
          messageID: info.messageID,
        });
      }
    );
  },

  onReaction: async function ({ message, threadsData, event, Reaction }) {
    const { author, newPrefix, setGlobal } = Reaction;

    if (event.userID !== author) return;

    if (setGlobal) {
      global.GoatBot.config.prefix = newPrefix;

      fs.writeFileSync(
        global.client.dirConfig,
        JSON.stringify(global.GoatBot.config, null, 2)
      );

      return message.reply(`✅ Global prefix updated: ${newPrefix}`);
    }

    await threadsData.set(event.threadID, newPrefix, "data.prefix");
    return message.reply(`✅ Chat prefix updated: ${newPrefix}`);
  },

  onChat: async function ({ event, message, threadsData }) {
    try {
      const globalPrefix = global.GoatBot.config.prefix;
      const threadPrefix =
        (await threadsData.get(event.threadID, "data.prefix")) ||
        globalPrefix;

      if (!event.body || event.body.toLowerCase() !== "prefix") return;

      const time = moment().tz("Asia/Dhaka").format("hh:mm A");

      const uptimeMs = process.uptime() * 1000;
      const formatUptime = (ms) => {
        const sec = Math.floor(ms / 1000) % 60;
        const min = Math.floor(ms / (1000 * 60)) % 60;
        const hr = Math.floor(ms / (1000 * 60 * 60));
        return `${hr}h ${min}m ${sec}s`;
      };

      // SAFE VIDEO LOAD
      let attachment;
      try {
        attachment = await utils.getStreamFromURL(
          "https://n.uguu.se/bcciMnqJ.mp4"
        );
      } catch (e) {
        console.log("⚠️ Video load failed:", e.message);
        attachment = null;
      }

      return message.reply({
        body: `╔═══════✦✧✦═══════╗
        PREFIX INFO
╚═══════✦✧✦═══════╝

🌐 Global Prefix: ${globalPrefix}
💬 Chat Prefix: ${threadPrefix}
❓ Help: ${threadPrefix}help
🕒 Time: ${time}
⏳ Uptime: ${formatUptime(uptimeMs)}
👤 Your ID: ${event.senderID}

👑 Owner: TONMOY`,

        attachment: attachment || undefined
      });

    } catch (err) {
      console.log("Prefix command error:", err);
      return message.reply("⚠️ Something went wrong, try again later.");
    }
  }
};
