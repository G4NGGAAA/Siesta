const axios = require('axios');

let handler = async (m, { text, kzm, reply }) => {
  if (!text) return reply('Masukkan prompt gambar, contoh:\n.animage 1girl, neko');
  await kzm.sendMessage(m.chat, { react: { text: '⏱️', key: m.key } });

  try {
    // REST API baru
    const apiURL = `https://api.ryuu-dev.offc.my.id/imagecreator/animage?prompt=${encodeURIComponent(text)}`;

    const { data } = await axios.get(apiURL);
    
    if (!data?.output?.results?.length) {
      return reply('❌ Gagal mendapatkan gambar, coba lagi nanti.');
    }

    const result = data.output.results[0].value;

    await kzm.sendMessage(m.chat, {
      image: { url: result },
      caption: `✅ Hasil AI Image:\n*${text}*`
    }, { quoted: m });

  } catch (e) {
    console.error('❌ REQUEST ERROR:', e);
    await kzm.sendMessage(m.chat, {
      react: { text: "❌", key: m.key }
    });
    reply(`❌ Error: ${e.message}`);
  }
};

handler.command = ['animage'];
handler.tags = ['ai'];
handler.help = ['animage <prompt>'];

module.exports = handler;