const axios = require('axios');

let handler = async (m, { kzm, text, reply }) => {
  if (!text) return reply('❌ Masukkan teks untuk membuat stiker.');

  await kzm.sendMessage(m.chat, { react: { text: "⏱️", key: m.key } });

  try {
    const sticker = `https://api.ryuu-dev.offc.my.id/tools/brat?text=${encodeURIComponent(text)}&apikey=RyuuGanteng`;

    await kzm.sendImageAsSticker(m.chat, sticker, m, {
      packname: global.packname,
      author: global.author
    });
  } catch (err) {
    console.error("❌ Error:", err);
    reply("Terjadi kesalahan saat membuat stiker.");
  }
};

handler.command = ["brat"];
module.exports = handler;