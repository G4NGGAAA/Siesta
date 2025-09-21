const { downloadContentFromMessage } = require('@whiskeysockets/baileys')

let handler = async (m, { kzm }) => {
  if (!m.quoted) throw 'Send/Reply Images with the caption *.readviewonve*'
  if (m.quoted.mtype !== 'viewOnceMessageV2') throw 'Ini bukan pesan view-once.'
  let msg = m.quoted.message
  let type = Object.keys(msg)[0]
  let media = await downloadContentFromMessage(msg[type], type == 'imageMessage' ? 'image' : 'video')
  let buffer = Buffer.from([])
  for await (const chunk of media) {
    buffer = Buffer.concat([buffer, chunk])
  }
  if (/video/.test(type)) {
    return kzm.sendFile(m.chat, buffer, 'media.mp4', msg[type].caption || '', m)
  } else if (/image/.test(type)) {
    return kzm.sendFile(m.chat, buffer, 'media.jpg', msg[type].caption || '', m)
  }
}

handler.help = ['readvo']
handler.tags = ['tools']
handler.command = ['readviewonce', 'read', 'liat', 'readvo'] 

module.exports = handler