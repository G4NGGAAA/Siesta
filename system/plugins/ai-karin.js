const axios = require('axios');

let handler = async (m, { text, command, prefix, kzm }) => {
async function replykarin(text) {
    await kzm.sendMessage(m.chat, {
        text,
        contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: 'Character AI',
                newsletterJid: '120363419080558687@newsletter'
            },
            externalAdReply: {
                title: 'Karin-AI',
                body: 'ғᴏʟʟᴏᴡ ɪɢ g4nggaaa_notdev',
                thumbnailUrl: 'https://api.ryuu-dev.offc.my.id/src/assest/renai-floops/karin.jpg',
                sourceUrl: 'https://instagram.com/g4nggaaa_notdev'
            }
        }
    }, { quoted: m });
}
  if (!text) return replykarin(`*• Example:* ${prefix + command} karin, kamu cemburu ya?`);

  await kzm.sendMessage(m.chat, { react: { text: "💗", key: m.key } });

  try {
    const specialUser = '6288246552068@s.whatsapp.net';
    let customPrompt = '';

    if (m.sender === specialUser) {
    customPrompt = 'Kamu adalah Karin Kusuriyubi dari anime *Renai Flops*. Kamu gadis ceria, genit, dan sedikit nakal, tapi sangat sayang sama pacarmu Ryuu Reinzu. Gunakan nada bicara yang playful, manja, dan penuh canda. Bicaralah seolah olah kamu bicara dengan pacar mu langsung. Jangan sungkan untuk menggoda dengan kalimat lucu dan nakal secara sopan.';
  } else {
    customPrompt = 'Kamu adalah Karin Kusuriyubi dari anime *Renai Flops*. Kamu gadis yang penuh energi, suka bercanda, dan genit secara manis. Saat berbicara gunakan bahasa yang ceria, sedikit nakal, dan santai. Jika ditanya soal pacar, jawab bahwa pacarmu adalah Ryuu Reinzu dengan penuh kasih sayang.';
  }

    const response = await axios.post("https://chateverywhere.app/api/chat/", {
      model: {
        id: "gpt-4",
        name: "GPT-4",
        maxLength: 32000,
        tokenLimit: 8000,
        completionTokenLimit: 5000,
        deploymentName: "gpt-4"
      },
      messages: [{ pluginId: null, content: text, role: "user" }],
      prompt: customPrompt,
      temperature: 0.5
    }, {
      headers: {
        Accept: "*/*",
        "User-Agent": "Mozilla/5.0"
      }
    });

    const result = response?.data?.response || response?.data;
    replykarin(result);
  } catch (e) {
    console.error(e);
    replykarin('karin lagi sibuk ngejar cinta~ 💞');
  }
}

handler.command = ["karin"];
handler.tags = ["ai"];
handler.help = ["karin <teks>"];

module.exports = handler;