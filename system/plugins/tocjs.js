/**
 * Fitur: Konversi Kode ESM ke CJS
 * Deskripsi: Mengubah sintaks JavaScript dari ECMAScript Modules (import/export) 
 * ke CommonJS (require/module.exports).
 * Dependencies: sucrase
 */

const { transform } = require('sucrase');

const handler = async (kzm, m, { text }) => {
    if (!text) {
        return kzm.reply(m.chat, `Silakan berikan kode JavaScript (ESM) untuk dikonversi.\n\n*Contoh Penggunaan:*\n.tocjs import path from 'path';\n\nexport function sayHello() {\n  console.log('Hello, CJS!');\n}`, m);
    }

    try {
        const convertedCode = transform(text, {
            transforms: ['imports']
        }).code;

        const resultText = `✅ *Konversi ESM ke CJS Berhasil!*\n\n\`\`\`javascript\n${convertedCode.trim()}\n\`\`\``;
        const buttons = [{
            type: 1,
            buttonText: {
                displayText: 'Salin Kode'
            },
            buttonId: convertedCode.trim()
        }];
        const buttonMessage = {
            text: resultText,
            footer: 'Dikonversi oleh Bot',
            buttons: buttons,
            headerType: 4, // Tipe header untuk menampilkan gambar
            jpegThumbnail: 'https://cdn-icons-png.flaticon.com/512/865/865223.png'
        };

        await kzm.sendMessage(m.chat, buttonMessage, { quoted: m });

    } catch (error) {
        console.error(error);
        await kzm.reply(m.chat, `Gagal mengonversi kode. Pastikan sintaks kode ESM Anda sudah benar.\n\n*Detail Error:*\n${error.message}`, m);
    }
};

handler.help = ['tocjs <kode>'];
handler.tags = ['tools'];
handler.command = ["tocjs", "esmtocjs"];


module.exports = handler;