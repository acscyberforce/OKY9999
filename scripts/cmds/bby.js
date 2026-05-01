const axios = require('axios');

const baseApiUrl = async () => {
    return "https://noobs-api.top/dipto";
};

module.exports.config = {
    name: "bby",
    aliases: ["baby", "bbe", "babe", "rocky"],
    version: "7.1.0",
    author: "Tonmoy",
    countDown: 0,
    role: 0,
    description: "Funny Stylish Baby Bot",
    category: "chat"
};

// 😆 Funny Replies
const randomReplies = [
"কি রে ডাকলি কেন? বিয়ে করবি নাকি? 😏💍",
"এই এই বেশি ডাকিস না, প্রেমে পড়ে যাবো কিন্তু 😳💔",
"তুই আবার আইছস? 🤨 miss করছস তাই না 😌",
"বলো সোনা 😚 টাকা নাই 😒",
"ডাক দিলি আর আমি আসলাম 😎",
"তুই কি মানুষ নাকি problem? 😑",
"এই রে crush আইছে 😳💘",
"ডাকিস না, প্রেমে পড়ে যাবো 😩",
"তুই আসলেই problem 😌 but ok"
];

// 🎨 Stylish + Random Boss System
function styleMsg(msg) {
    const showBoss = Math.random() < 0.35; // 35% chance

    const boss = showBoss ? "\n👑 Tonmoy Boss" : "";

    const styles = [
        (m) => `╭──〔 🤖 𝙱𝙱𝚈 〕──╮\n┃ 💬 ${m}${boss}\n╰──────────────╯`,
        (m) => `┌──[ 💖 𝙱𝙱𝚈 ]──┐\n│ 💬 ${m}${boss}\n└──────────────┘`,
        (m) => `╔═══════〔 😈 𝙱𝙱𝚈 〕═══════╗\n║ 💬 ${m}${boss}\n╚══════════════════╝`
    ];

    return styles[Math.floor(Math.random() * styles.length)](msg);
}

module.exports.onStart = async ({ api, event, args }) => {
    try {
        if (!args[0]) {
            const msg = randomReplies[Math.floor(Math.random() * randomReplies.length)];
            return api.sendMessage(styleMsg(msg), event.threadID, event.messageID);
        }

        const text = args.join(" ").toLowerCase();

        const { data } = await axios.get(
            `${await baseApiUrl()}/baby?text=${encodeURIComponent(text)}&font=1`
        );

        return api.sendMessage(styleMsg(data.reply), event.threadID, event.messageID);

    } catch (e) {
        return api.sendMessage("❌ Error occurred!", event.threadID);
    }
};

module.exports.onChat = async ({ api, event }) => {
    try {
        const body = event.body?.toLowerCase() || "";

        if (
            body.startsWith("baby") ||
            body.startsWith("bby") ||
            body.startsWith("jan") ||
            body.startsWith("babu") ||
            body.startsWith("janu")
        ) {
            const text = body.replace(/^\S+\s*/, "");

            if (!text) {
                const msg = randomReplies[Math.floor(Math.random() * randomReplies.length)];
                return api.sendMessage(styleMsg(msg), event.threadID, event.messageID);
            }

            const { data } = await axios.get(
                `${await baseApiUrl()}/baby?text=${encodeURIComponent(text)}&font=1`
            );

            return api.sendMessage(styleMsg(data.reply), event.threadID, event.messageID);
        }

    } catch (err) {
        return api.sendMessage("❌ Error!", event.threadID);
    }
};

module.exports.onReply = async ({ api, event }) => {
    try {
        if (event.type === "message_reply") {
            const text = event.body?.toLowerCase() || "";

            const { data } = await axios.get(
                `${await baseApiUrl()}/baby?text=${encodeURIComponent(text)}&font=1`
            );

            return api.sendMessage(styleMsg(data.reply), event.threadID, event.messageID);
        }
    } catch (err) {
        return api.sendMessage("❌ Error!", event.threadID);
    }
};
