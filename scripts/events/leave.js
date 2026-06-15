const { getTime, drive } = global.utils;

module.exports = {
config: {
name: "leave",
version: "1.5",
author: "TONMOY",
category: "events"
},

langs: {
	en: {
		session1: "morning",
		session2: "noon",
		session3: "afternoon",
		session4: "evening",
		leaveType1: "Left The Group",
		leaveType2: "Was Kicked From The Group",

		defaultLeaveMessage: `

╔══════════════════════╗
😢 GOODBYE
╚══════════════════════╝

👤 Name: {userNameTag}
🏠 Group: {threadName}

📌 Status:
{type}

⏰ Time: {time}

━━━━━━━━━━━━━━━━━━

💔 আমরা তোমাকে মিস করবো

❤️ Allah Hafez
`
}
},

onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
	if (event.logMessageType == "log:unsubscribe")
		return async function () {
			const { threadID } = event;
			const threadData = await threadsData.get(threadID);

			if (!threadData.settings.sendLeaveMessage)
				return;

			const { leftParticipantFbId } = event.logMessageData;

			if (leftParticipantFbId == api.getCurrentUserID())
				return;

			const hours = getTime("HH");
			const threadName = threadData.threadName;
			const userName = await usersData.getName(leftParticipantFbId);

			let { leaveMessage = getLang("defaultLeaveMessage") } = threadData.data;

			leaveMessage = leaveMessage
				.replace(/\{userName\}|\{userNameTag\}/g, userName)
				.replace(
					/\{type\}/g,
					leftParticipantFbId == event.author
						? getLang("leaveType1")
						: getLang("leaveType2")
				)
				.replace(/\{threadName\}|\{boxName\}/g, threadName)
				.replace(/\{time\}/g, hours)
				.replace(
					/\{session\}/g,
					hours <= 10
						? getLang("session1")
						: hours <= 12
						? getLang("session2")
						: hours <= 18
						? getLang("session3")
						: getLang("session4")
				);

			const form = {
				body: leaveMessage,
				mentions: [
					{
						id: leftParticipantFbId,
						tag: userName
					}
				]
			};

			if (threadData.data.leaveAttachment) {
				const files = threadData.data.leaveAttachment;

				const attachments = files.reduce((acc, file) => {
					acc.push(drive.getFile(file, "stream"));
					return acc;
				}, []);

				form.attachment = (await Promise.allSettled(attachments))
					.filter(({ status }) => status == "fulfilled")
					.map(({ value }) => value);
			}

			message.send(form);
		};
}

};
