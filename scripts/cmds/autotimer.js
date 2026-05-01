const moment = require("moment-timezone");

module.exports.config = {
  name: "autotimer",
  version: "7.1",
  role: 0,
  author: "Tonmoy",
  description: "🤖 AI স্টাইল স্মার্ট অটো টাইম মেসেজ সিস্টেম",
  category: "AI-Auto",
  countDown: 3,
};

module.exports.onLoad = async function ({ api }) {

  const aiMessages = {
    "12:00 AM": "🤖 [AI]: এখন রাত ১২টা বাজে... বিশ্রাম নেওয়া জরুরি 😴 তোমার শরীর রিসেট মোডে যেতে চাচ্ছে।",
    "01:00 AM": "🤖 [AI]: গভীর রাত চলছে... এখন ঘুম না হলে শরীর দুর্বল হয়ে যাবে 💤",
    "02:00 AM": "🤖 [AI]: সতর্কতা! এই সময় জেগে থাকা স্বাস্থ্যকর না 😶 দ্রুত ঘুমাও।",
    "03:00 AM": "🤖 [AI]: রাত গভীর... সিস্টেম বলছে এখন সবাই অফলাইন থাকা উচিত 🌌",
    "04:00 AM": "🤖 [AI]: ভোর আসছে... নতুন দিনের শক্তি লোড হচ্ছে 🌄",
    "05:00 AM": "🤖 [AI]: ফজরের সময় হয়েছে 🤲 দিনটা ভালোভাবে শুরু করো।",
    "06:00 AM": "🤖 [AI]: নতুন দিন শুরু! ঘুম থেকে উঠে পড়ো ☀️",
    "07:00 AM": "🤖 [AI]: সকালের নাস্তা করো 🍞 শক্তি দরকার তোমার শরীরের।",
    "08:00 AM": "🤖 [AI]: কাজ শুরু করার সময় ⚡ ফোকাস রাখো।",
    "09:00 AM": "🤖 [AI]: প্রোডাক্টিভিটি মোড অন 🧠 মনোযোগ দাও কাজে।",
    "10:00 AM": "🤖 [AI]: এনার্জি ভালো রাখো 🚀 এগিয়ে চলো।",
    "11:00 AM": "🤖 [AI]: লাঞ্চের আগ মুহূর্ত 😌 একটু ধৈর্য ধরো।",
    "12:00 PM": "🤖 [AI]: দুপুর ১২টা 🌤️ পানি পান করো এবং বিশ্রাম নাও।",
    "01:00 PM": "🤖 [AI]: নামাজ/বিশ্রামের সময় 🤲 শরীরকে শান্ত করো।",
    "02:00 PM": "🤖 [AI]: খাবার খেয়েছো তো? 🍛 শরীর রিফ্রেশ দরকার।",
    "03:00 PM": "🤖 [AI]: মনোযোগ হারাবে না ⚡ আবার কাজে ফিরে যাও।",
    "04:00 PM": "🤖 [AI]: একটু ক্লান্তি আসছে 😌 ছোট বিরতি নাও।",
    "05:00 PM": "🤖 [AI]: রিফ্রেশ টাইম 🙂 নিজেকে হালকা করো।",
    "06:00 PM": "🤖 [AI]: সন্ধ্যা হয়ে যাচ্ছে 🌇 পরিবারের সাথে সময় কাটাও।",
    "07:00 PM": "🤖 [AI]: দিন শেষের দিকে 🌃 কাজ গুছিয়ে নাও।",
    "08:00 PM": "🤖 [AI]: এখন শান্ত থাকার সময় 🧘",
    "09:00 PM": "🤖 [AI]: ঘুমের প্রস্তুতি নাও 😴",
    "10:00 PM": "🤖 [AI]: শুভরাত্রি 🌙 শরীরকে বিশ্রাম দাও।",
    "11:00 PM": "🤖 [AI]: রাত গভীর... ভালো ঘুমই সফলতার চাবি 🥰"
  };

  let lastSentTime = "";

  const runAIClock = async () => {
    const now = moment().tz("Asia/Dhaka").format("hh:mm A");

    if (now !== lastSentTime && aiMessages[now]) {
      lastSentTime = now;

      const date = moment().tz("Asia/Dhaka").format("DD-MM-YYYY");

      const msg = `
╔════════════════════╗
🤖 AI SYSTEM ACTIVE
⏰ সময়: ${now}
📅 তারিখ: ${date}
╚════════════════════╝

${aiMessages[now]}

━━━━━━━━━━━━━━━━━━
👑 BOT OWNER: TONMOY
━━━━━━━━━━━━━━━━━━
`;

      try {
        const threads = await api.getThreadList(1000, null, ["INBOX"]);
        const groups = threads.filter(t => t.isGroup);

        for (const thread of groups) {
          api.sendMessage(msg, thread.threadID);
        }

        console.log("🤖 Sent:", now);
      } catch (err) {
        console.error("❌ Error:", err);
      }
    }
  };

  setInterval(runAIClock, 30000);
};

module.exports.onStart = () => {};
