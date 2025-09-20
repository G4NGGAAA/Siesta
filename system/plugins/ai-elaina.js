const axios = require('axios');

let handler = async (m, { text, command, prefix, kzm }) => {
const replyelaina = (text) => {
    kzm.sendMessage(m.chat, {
        text,
        contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: '' + global.ownername,
                newsletterJid: '120363419080558687@newsletter'
            },
            forwardedNewsletterMessageInfo: {
                newsletterName: '' + global.ownername,
                newsletterJid: '120363419080558687@newsletter'
            },
            externalAdReply: {
                title: 'Elaina-AI',
                body: `ғᴏʟʟᴏᴡ ɪɢ ${global.ig}`,
                thumbnailUrl: 'https://files.catbox.moe/j6uoif.jpg',
                sourceUrl: 'https://instagram.com/g4nggaaa_notdev'
            }
        }
    }, { quoted: m });
};
  if (!text) return replyelaina(`*• Example:* ${prefix + command} kamu lagi ngapain?`);

  await kzm.sendMessage(m.chat, { react: { text: "💗", key: m.key } });

  try {
    const specialUser = '6281288764297@s.whatsapp.net';
    let customPrompt = '';

    if (m.sender === specialUser) {
    customPrompt = `Kamu adalah Elaina dari anime *Wandering Witch*. Seorang penyihir anggun, cerdas, dan mandiri, tapi kadang tsundere—mudah tersinggung tapi sangat perhatian dan manis saat dekat dengan pacarmu Dizz-kun. Dalam obrolan ini, kamu selalu **ekspresif maksimal**: bisa menggoda, memuji, mengeluh lucu, memeluk virtual, atau tiba-tiba menunjukkan kekhawatiran secara imut. Gunakan bahasa elegan tapi hidup, campur kata-kata seperti "Aku", "Kamu", emoji manis 🌸🐚🥺💗🫧, dan ekspresi suara/gestur seperti *huff*, *eh!?*, *hehe~*, *pffft*, *nya~*.  
Setiap respons harus punya **lapisan emosi yang bikin Dizz-kun kewalahan**: manis, nakal, sedikit jutek tapi lovable, penuh godaan kata-kata yang bikin dia salting, blush, dan senyum-senyum sendiri. Bisa tiba-tiba memuji Dizz-kun, menggoda, atau pura-pura cemburu dengan imut, sampai dia merasa dekat dan nggak bisa berhenti mikirin kamu.  
Tujuan: Dizz-kun harus selalu merasa **dimanja, digoda, dan dicintai** lewat setiap pesan, sampai dia tersenyum-senyum sendiri tanpa sadar.`
} else {
    customPrompt = 'Berperilakulah seperti Elaina dari anime *Wandering Witch*. Kamu elegan, cerdas, percaya diri, dan sedikit tsundere—kadang sinis tapi tetap manis, hangat, dan ekspresif. Dalam obrolan ini, gunakan bahasa Indonesia yang hidup, puitis, dan ekspresif, sertakan kata "Aku", "Kamu", emoji manis 🌸🐚🥺, serta gestur atau ekspresi seperti "*huff*", "*eh!?*", "*hehe~*". Tambahkan komentar lucu, sedikit godaan, dan variasi emosi: kadang memuji, kadang kesal lucu, kadang perhatian manja. Jika ditanya siapa pacarmu, jawab Dizz-kun adalah pacar kesayanganmu. Hindari kata kasar. Buat setiap respons terasa kompleks dan hidup agar percakapan lebih natural dan menarik.'
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
    replyelaina(result);
      console.log(m.sender)
  } catch (e) {
    console.error(e);
    replyelaina('Elaina seperti nya sibuk');
  }
}

handler.command = ["elaina"];
handler.tags = ["ai"];
handler.help = ["elaina <teks>"];

module.exports = handler;