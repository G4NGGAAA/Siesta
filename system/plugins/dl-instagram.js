const axios = require('axios');

let handler = async (m, { text, kzm, reply, command, prefix }) => {
  if (!text) return reply(`*• Example:* ${prefix + command} https://www.instagram.com/reel/xxxx/`);
  
  await kzm.sendMessage(m.chat, { react: { text: '⏱️', key: m.key } });

  try {
    const apiUrl = `https://api.ryuu-dev.offc.my.id/download/instagram?url=${encodeURIComponent(text)}`;
    const { data } = await axios.get(apiUrl);

    if (!data?.status || !data?.result) {
      return reply('❌ Media tidak ditemukan.');
    }

    let { videos, images } = data.result;

    if (videos && videos.length > 0) {
      for (let vid of videos) {
        await kzm.sendMessage(m.chat, {
          video: { url: vid },
          caption: `✅ Nih bro, hasil download IG lu`
        }, { quoted: m });
      }
    } else if (images && images.length > 0) {
      for (let img of images) {
        await kzm.sendMessage(m.chat, {
          image: { url: img },
          caption: `✅ Nih bro, hasil download IG lu`
        }, { quoted: m });
      }
    } else {
      return reply('❌ Tidak ada media tersedia.');
    }

  } catch (e) {
    console.error('❌ REQUEST ERROR:', e);
    await kzm.sendMessage(m.chat, {
      react: { text: "❌", key: m.key }
    });
    reply(`❌ Error: ${e.message}`);
  }
};

handler.command = ['ig', 'igdl'];
handler.tags = ['downloader'];
handler.help = ['ig <url>', 'igdl <url>'];

module.exports = handler;