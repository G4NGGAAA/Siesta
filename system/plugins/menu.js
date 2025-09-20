require("../config") 

let handler = async (m, { kzm, reply, prefix, pushname }) => {
let teks = `
Halo ${pushname}, Aku adalah asisten virtual mu.

┏───• ❲ 𝗜𝗡𝗙𝗢 𝗕𝗢𝗧 ❳
│ • Bot Name: ${info.botName}
│ • Owner: ${info.ownerName}
│ • Type: 𝐜𝐚𝐬𝐞 𝐱 𝐩𝐥𝐮𝐠𝐢𝐧
│ • Total Cmd: 0
│ • Versi: 0.0
│ • Baileys: @shennmine/baileys
│ • Base:
┗────────────────··

╭━━━━[ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 ]
┃ ▣ ${prefix}menu → \`show bot menu\`
╰━━━━━━━━━━━━━❍

┏───• ❲ STICKER ❳
│ • ${prefix}stiker
┗────────────────··

`
await kzm.sendMessage(m.chat, {
caption: teks,
footer: "© SIESTA By Glitch",
buttons: [
{
buttonId: 'action',
buttonText: { displayText: 'ini pesan interactiveMeta' },
type: 4,
nativeFlowInfo: {
name: 'single_select',
paramsJson: JSON.stringify({
title: 'Menu Botz',
sections: [
{
title: 'Menu Populer',
highlight_label: 'Recommended',
rows: [
{ title: '1', id: '.4' },
{ title: '2', id: '.3' },
{ title: '3', id: '.2' },
{ title: '4', id: '.1' }
]
}
]
})
}
}
],
headerType: 1,
viewOnce: true,
video: { url: "https://files.catbox.moe/m2gop2.mp4" },
mimetype: 'video/mp4',
contextInfo: {
isForwarded: true,
mentionedJid: [m.sender, global.owner + "@s.whatsapp.net"],
forwardedNewsletterMessageInfo: {
newsletterJid: "120363419080558687@newsletter",
newsletterName: "G4NGGAAA PROJECT"
},
externalAdReply: {
title: "G4NGGAAAA",
body: "",
thumbnailUrl: "https://files.catbox.moe/12hlmp.jpg",
sourceUrl: "https://wa.me/6285855962331",
mediaType: 1,
renderLargerThumbnail: true,
}
}
}, { quoted: m })

// Tambahan relayMessage button pengganti devinfo
await kzm.relayMessage(m.chat, {
"interactiveMessage": {
"body": {
"text": "SiestaBotz"
},
"nativeFlowMessage": {
"buttons": [
{
"name": "cta_url",
"buttonParamsJson": JSON.stringify({
display_text: "Instagram 📷",
url: "https://instagram.com/g4nggaaa_notdev"
})
}
],
"messageParamsJson": "{}"
}
}
}, {})
}

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ["menu"];

module.exports = handler;
