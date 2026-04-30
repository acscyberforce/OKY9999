const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
	config: {
		name: "os",
		version: "1.1",
		author: "siyam8881",
		countDown: 5,
		role: 2,
		shortDescription: "sarcasm",
		longDescription: "Responds with random media when someone says 'os'",
		category: "reply",
	},

	onStart: async function () {},

	onChat: async function ({ event, message }) {
		if (!event.body) return;

		// trim + includes ব্যবহার করা হলো
		const text = event.body.toLowerCase().trim();
		if (text.includes("os")) {

			const mediaLinks = [
				"https://files.catbox.moe/8066ce.mp4",
				"https://files.catbox.moe/yf3gz5.mp4",
				"https://files.catbox.moe/rhjkhg.mp4",
				"https://files.catbox.moe/rq2fzt.mp4",
				"https://files.catbox.moe/j0ifa2.mp4",
				"https://files.catbox.moe/bni2rv.mp4"
			];

			const validLinks = mediaLinks.filter(link => link && link.trim() !== "");
			const randomLink = validLinks[Math.floor(Math.random() * validLinks.length)];

			try {
				const fileName = `os_${Date.now()}.mp4`;
				const filePath = path.join(__dirname, fileName);

				const response = await axios.get(randomLink, { responseType: "stream" });

				const writer = fs.createWriteStream(filePath);
				response.data.pipe(writer);

				writer.on("finish", async () => {
					await message.reply({
						body: "-!X-z⁶²M?\n\n々𝗪͜͡𝗛𝗢 -? 🎭👑\n\n- 々𝗧𝗢𝗡𝗠𝗢𝗬 𝗩𝗜𝗥𝗨𝗦🚩🏴‍☠️📨",
						attachment: fs.createReadStream(filePath)
					});

					fs.unlinkSync(filePath);
				});

				writer.on("error", async (err) => {
					console.error(err);
					await message.reply("Sorry, couldn't load the media.");
				});

			} catch (err) {
				console.error("Failed to fetch media:", err.message);
				await message.reply("Sorry, couldn't load the media.");
			}
		}
	}
};
