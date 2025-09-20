const { Sticker, StickerTypes } = require('wa-sticker-formatter');

let handler = async (m, { kzm, text, reply }) => {
  try {
    // ambil pesan quoted atau pesan utama
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    let media = await q.download();

    // set packname & author (pakai | untuk pisah)
    let teks1 = text?.split('|')[0] ? text.split('|')[0] : global.packname;
    let teks2 = text?.split('|')[1] ? text.split('|')[1] : global.author;

    // validasi mime
    if (!/image|video|webp/.test(mime)) {
      return reply(
        `Kirim/reply gambar/video/stiker dengan caption *${m.prefix + m.command}*\nDurasi Video/GIF 1-5 Detik 🌸`
      );
    }

    // reaksi loading
    await kzm.sendMessage(m.chat, { react: { text: "⏱️", key: m.key } });

    if (/webp/.test(mime)) {
      // === STICKER WEBP ===
      const stiker = new Sticker(media, {
        pack: teks1,
        author: teks2,
        type: StickerTypes.FULL,
        quality: 80,
      });

      const buffer = await stiker.toBuffer();
      await kzm.sendMessage(m.chat, { sticker: buffer }, { quoted: m });

    } else if (/video/.test(mime)) {
      // === STICKER VIDEO ===
      if ((q.msg || q).seconds > 5) return reply('Maksimal 5 detik yaa sayang 🥺🫧');
      await kzm.sendVideoAsSticker(m.chat, media, m, {
        packname: teks1,
        author: teks2,
      });

    } else if (/image/.test(mime)) {
      // === STICKER FOTO ===
      await kzm.sendImageAsSticker(m.chat, media, m, {
        packname: teks1,
        author: teks2,
      });
    }
  } catch (err) {
    reply(`❌ Gagal membuat stiker\n${err.message}`);
    console.error('❌ Gagal membuat stiker:', err);
  }
};

handler.command = ["s", "stiker", "sticker"];
module.exports = handler;