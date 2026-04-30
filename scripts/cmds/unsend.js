module.exports = {
	config: {
		name: "unsend",
		aliases: [],
		version: "2.0",
		author: "TONMOY",
		role: 0,
		description: {
			en: "Unsend bot message (no prefix)"
		},
		category: "box chat"
	},

	onChat: async function ({ event, message, api }) {
		const body = event.body?.trim().toLowerCase();

		// Only trigger if user types "u"
		if (body !== "u") return;

		// Must reply to a message
		if (!event.messageReply) return;

		// Only unsend bot's own message
		if (event.messageReply.senderID != api.getCurrentUserID()) return;

		try {
			await message.unsend(event.messageReply.messageID);
		} catch (err) {
			console.error("Unsend error:", err);
		}
	}
};
