module.exports = {
  config: {
    name: "fork",
    aliases: ["repo", "link"],
    version: "1.0",
    author: "Rocky",
    countDown: 3,
    role: 0,
    longDescription: "Returns the link to the official, updated fork of the bot's repository.",
    category: "system",
    guide: { en: "{pn}" }
  },

  onStart: async function({ message }) {
    const text = "𝐻𝐴 𝐻𝐴 𝐹𝑈𝐶𝐾 𝑌𝑂𝑈𝑅 𝐷𝐴𝐷 𝐼𝑀 𝑇𝑂𝑁𝑀𝑂𝑌 𝐵𝑂𝑇 🙃";
    
    message.reply(text);
  }
};
