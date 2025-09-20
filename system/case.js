require("./config")
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const util = require('util')
const axios = require('axios')
const { exec } = require("child_process")
const { Sticker, StickerTypes } = require('wa-sticker-formatter')
const { sendImage, sendImageAsSticker, sendVideoAsSticker } = require("../lib/utils")

module.exports = async (kzm, m) => {
try {
const from = m.key.remoteJid
const body = (
(m.mtype === 'conversation' && m.message.conversation) ||
(m.mtype === 'imageMessage' && m.message.imageMessage.caption) ||
(m.mtype === 'documentMessage' && m.message.documentMessage.caption) ||
(m.mtype === 'videoMessage' && m.message.videoMessage.caption) ||
(m.mtype === 'extendedTextMessage' && m.message.extendedTextMessage.text) ||
(m.mtype === 'buttonsResponseMessage' && m.message.buttonsResponseMessage.selectedButtonId) ||
(m.mtype === 'templateButtonReplyMessage' && m.message.templateButtonReplyMessage.selectedId)
) ? (
(m.mtype === 'conversation' && m.message.conversation) ||
(m.mtype === 'imageMessage' && m.message.imageMessage.caption) ||
(m.mtype === 'documentMessage' && m.message.documentMessage.caption) ||
(m.mtype === 'videoMessage' && m.message.videoMessage.caption) ||
(m.mtype === 'extendedTextMessage' && m.message.extendedTextMessage.text) ||
(m.mtype === 'buttonsResponseMessage' && m.message.buttonsResponseMessage.selectedButtonId) ||
(m.mtype === 'templateButtonReplyMessage' && m.message.templateButtonReplyMessage.selectedId)
) : '';

const budy = (typeof m.text === 'string') ? m.text : '';
const prefixRegex = /^[°zZ#$@*+,.?=''():√%!¢£¥€π¤ΠΦ_&><`™©®Δ^βα~¦|/\\©^]/;
const prefix = prefixRegex.test(body) ? body.match(prefixRegex)[0] : '.';
const isCmd = body.startsWith(prefix);
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
const args = body.trim().split(/ +/).slice(1)
const text = q = args.join(" ")
const quoted = m.quoted ? m.quoted : m
const mime = (quoted.msg || quoted).mimetype || ''
const qmsg = (quoted.msg || quoted)
const sender = m.key.fromMe ? (kzm.user.id.split(':')[0]+'@s.whatsapp.net' || kzm.user.id) : (m.key.participant || m.key.remoteJid)
const botNumber = await kzm.decodeJid(kzm.user.id)
const senderNumber = sender.split('@')[0]
const isCreator = (m && m.sender && [botNumber, ...global.info.ownerNumber].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)) || false;
const pushname = m.pushName || `${senderNumber}`
const isBot = botNumber.includes(senderNumber)

const reply = (teks) => {
kzm.sendMessage(from, { text : teks }, { quoted : m })
}

//######## PLUGINS ########
const pluginsLoader = async (directory) => {
    let plugins = [];

    const loadRecursive = async (dir) => {
        const files = fs.readdirSync(dir);
        for (let file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                // Rekursif ke folder dalam
                await loadRecursive(filePath);
            } else if (file.endsWith(".js") || file.endsWith(".mjs")) {
                try {
                    let plugin;

                    if (file.endsWith(".mjs")) {
                        // ESM pakai dynamic import()
                        const module = await import(pathToFileURL(filePath).href);
                        plugin = module.default || module;
                    } else {
                        // CJS pakai require()
                        const resolvedPath = require.resolve(filePath);
                        if (require.cache[resolvedPath]) {
                            delete require.cache[resolvedPath];
                        }
                        plugin = require(filePath);
                    }

                    plugins.push(plugin);
                } catch (error) {
                    console.log(`[Plugin Error] ${filePath}:`, error);
                }
            }
        }
    };

    await loadRecursive(directory);
    return plugins;
};

// === Load semua plugin ===
const plugins = await pluginsLoader(path.resolve(__dirname, "./plugins"));

/**
 * Context yang dikirim ke setiap plugin
 */
const plug = {
    kzm,              // alias socket
    prefix,            // prefix bot
    reply, 
    command,           // command yang dipanggil user
    reply,             // fungsi reply biasa
    text,              // isi text setelah command
    isCreator,         // cek apakah owner
    isGroup: m.isGroup,
    isPrivate: !m.isGroup,
    pushname,          // nama pengirim
    args               // argumen array
};

// === Eksekusi plugin sesuai command ===
for (let plugin of plugins) {
    if (plugin.command && plugin.command.find(e => {
        if (e instanceof RegExp) return e.test(command.toLowerCase());
        return e === command.toLowerCase();
    })) {
        if (plugin.owner && !isCreator) return reply(mess.owner);
        if (plugin.group && !plug.isGroup) return reply(mess.group);
        if (plugin.private && !plug.isPrivate) return reply(mess.private);

        if (typeof plugin !== "function") return;
        await plugin(m, plug);
    }
}
//######## PLUGINS ########
switch(command) {

case 's':
case 'stiker':
case 'sticker': {
  if (!quoted) return reply(`ᴋɪʀɪᴍ ᴀᴛᴀᴜ ʀᴇᴘʟʏ ғᴏᴛᴏ/ᴠɪᴅᴇᴏ/ɢɪғ ᴡɪᴛʜ ᴄᴀᴘᴛɪᴏɴ ${prefix+command}\nᴠɪᴅᴇᴏ ᴅᴜʀᴀsɪ 1-20 ᴅᴇᴛɪᴋ`)
  kzm.sendMessage(m.chat, { react: { text: '🕒', key: m.key }})

  if (/image/.test(mime)) {
    let media = await quoted.download()
    await sendImageAsSticker(kzm, m.chat, media, m, { packname: global.sticker.packname, author: global.sticker.author })
  } else if (/video/.test(mime)) {
    if ((quoted.msg || quoted).seconds > 20) return reply(`ᴋɪʀɪᴍ ᴠɪᴅᴇᴏ ᴅᴜʀᴀsɪ 1-20 ᴅᴇᴛɪᴋ`)
    kzm.sendMessage(m.chat, { react: { text: '🕒', key: m.key }})
    let media = await quoted.download()
    await sendVideoAsSticker(kzm, m.chat, media, m, { packname: global.sticker.packname, author: global.sticker.author })
  } else {
    reply(`ᴋɪʀɪᴍ ᴀᴛᴀᴜ ʀᴇᴘʟʏ ғᴏᴛᴏ/ᴠɪᴅᴇᴏ/ɢɪғ ᴡɪᴛʜ ᴄᴀᴘᴛɪᴏɴ ${prefix+command}\nᴠɪᴅᴇᴏ ᴅᴜʀᴀsɪ 1-20 ᴅᴇᴛɪᴋ`)
  }
}
break

case "addadmin": {
if (!text) return m.reply(example("username"))
if (!isCreator) return kzmReply(msg.owner)
let username = text.toLowerCase()
let email = username+"@gmail.com"
let name = capital(args[0])
let password = username+crypto.randomBytes(2).toString('hex')
let f = await fetch(domain + "/api/application/users", {
"method": "POST",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
},
"body": JSON.stringify({
"email": email,
"username": username.toLowerCase(),
"first_name": name,
"last_name": "Admin",
"root_admin": true,
"language": "en",
"password": password.toString()
})
})
let data = await f.json();
if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2))
let user = data.attributes
var orang
if (isGroup) {
orang = m.sender
await m.reply("*Berhasil Membuat Akun Admin Panel ✅*\nData Akun Sudah Dikirim Ke Private Chat")
} else {
orang = m.chat
}
var teks = `
*Berhasil Membuat Admin Panel ✅*

* *ID :* ${user.id}
* *Nama :* ${user.first_name}
* *Created :* ${user.created_at.split("T")[0]}
`
let msgii = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { 
"messageContextInfo": { 
"deviceListMetadata": {}, 
"deviceListMetadataVersion": 2
}, 
interactiveMessage: proto.Message.InteractiveMessage.create({
contextInfo: { 
mentionedJid: [m.sender], 
externalAdReply: {
showAdAttribution: true }
}, body: proto.Message.InteractiveMessage.Body.create({ 
text: teks
}), 
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ 
buttons: [{
"name": "cta_url",
"buttonParamsJson": `{\"display_text\":\"Login Server Panel\",\"url\":\"${global.domain}\",\"merchant_url\":\"https://www.google.com\"}`
}, 
{
"name": "cta_copy",
"buttonParamsJson": `{\"display_text\":\"Copy Username\",\"id\":\"123456789\",\"copy_code\":\"${user.username}\"}`
},
{
"name": "cta_copy",
"buttonParamsJson": `{\"display_text\":\"Copy Password\",\"id\":\"123456789\",\"copy_code\":\"${password.toString()}\"}`
}]
})
})} 
}}, {userJid: m.sender, quoted: qchanel}) 
await kzm.relayMessage(orang, msgii.message, { 
messageId: msgii.key.id 
})
}
break
case "addadmin2": {
if (!text) return m.reply(example("nama,6283XXX"))
if (!isCreator) return kzmReply(msg.owner)
if (!args[0]) return m.reply(example("nama,6283XXX"))
if (!text.split(",")) return m.reply(example("nama,6283XXX"))
var buyyer = text.split(",")[0].toLowerCase()
if (!buyyer) return m.reply(example("nama,6283XXX"))
var ceknya = text.split(",")[1]
if (!ceknya) return m.reply(example("nama,6283XXX"))
var client = text.split(",")[1].replace(/[^0-9]/g, '')+'@s.whatsapp.net'
var check = await kzm.onWhatsApp(ceknya)
if (!check[0].exists) return m.reply("Nomor Buyyer Tidak Valid!")
let username = buyyer.toLowerCase()
let email = username+"@gmail.com"
let name = capital(username)
let password = username+crypto.randomBytes(2).toString('hex')
let f = await fetch(domain + "/api/application/users", {
"method": "POST",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
},
"body": JSON.stringify({
"email": email,
"username": username.toLowerCase(),
"first_name": name,
"last_name": "Admin",
"root_admin": true,
"language": "en",
"password": password.toString()
})
})
let data = await f.json();
if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2))
let user = data.attributes
await m.reply(`*Berhasil Membuat Akun Admin Panel ✅*\nData Akun Sudah Dikirim Ke Nomor ${ceknya}`)
var teks = `
*Berhasil Membuat Admin Panel ✅*

* *ID :* ${user.id}
* *Nama :* ${user.first_name}
* *Created :* ${user.created_at.split("T")[0]}
`
let msgii = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { 
"messageContextInfo": { 
"deviceListMetadata": {}, 
"deviceListMetadataVersion": 2
}, 
interactiveMessage: proto.Message.InteractiveMessage.create({
contextInfo: { 
mentionedJid: [m.sender], 
externalAdReply: {
showAdAttribution: true }
}, body: proto.Message.InteractiveMessage.Body.create({ 
text: teks
}), 
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ 
buttons: [{
"name": "cta_url",
"buttonParamsJson": `{\"display_text\":\"Login Server Panel\",\"url\":\"${global.domain}\",\"merchant_url\":\"https://www.google.com\"}`
}, 
{
"name": "cta_copy",
"buttonParamsJson": `{\"display_text\":\"Copy Username\",\"id\":\"123456789\",\"copy_code\":\"${user.username}\"}`
},
{
"name": "cta_copy",
"buttonParamsJson": `{\"display_text\":\"Copy Password\",\"id\":\"123456789\",\"copy_code\":\"${password.toString()}\"}`
}]
})
})} 
}}, {userJid: m.sender, quoted: qchanel}) 
await kzm.relayMessage(client, msgii.message, { 
messageId: msgii.key.id 
})
}
break
case "deladmin": {
if (!isCreator) return kzmReply(msg.owner)
if (!args[0]) return m.reply(example("id\n\nuntuk melihat id admin ketik *.listadmin*"))
let cek = await fetch(domain + "/api/application/users?page=1", {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
}
})
let res2 = await cek.json();
let users = res2.data;
let getid = null
let idadmin = null
await users.forEach(async (e) => {
if (e.attributes.id == args[0] && e.attributes.root_admin == true) {
getid = e.attributes.username
idadmin = e.attributes.id
let delusr = await fetch(domain + `/api/application/users/${idadmin}`, {
"method": "DELETE",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
}
})
let res = delusr.ok ? {
errors: null
} : await delusr.json()
}
})
if (idadmin == null) return m.reply("ID Admin Tidak Ditemukan!")
m.reply(`Berhasil Menghapus Admin Panel *${capital(getid)}*`)
}
break
case "listadmin": {
let cek = await fetch(domain + "/api/application/users?page=1", {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
}
})
let res2 = await cek.json();
let users = res2.data;
let totaladmin = 0
if (users.length < 1 ) return m.reply("Tidak Ada Admin Panel")
var teks = " *LIST ADMIN PANEL *\n\n"
await users.forEach((i) => {
if (i.attributes.root_admin !== true) return
totaladmin += 1
teks += `\`📡ID User ${i.attributes.id}\`
* Nama : *${i.attributes.first_name}*
* Created : ${i.attributes.created_at.split("T")[0]}\n\n`
})
teks += ` Total Admin : *${totaladmin} Admin*`
kzm.sendText(m.chat, teks, qtoko)
}
break

case "cpanel": case "addpanel": case "buatpanel": {
if (!isCreator && !isReseller) return kzmReply(msg.owner)
if (global.apikey.length < 1) return m.reply("Apikey Tidak Ditemukan!")
if (!args[0]) return m.reply(example("nama"))
global.panel = [text.toLowerCase()]
let teksnya = "Silahkan Pilih Ram Server Panel"
let msgii = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { 
"messageContextInfo": { 
"deviceListMetadata": {}, 
"deviceListMetadataVersion": 2
}, 
interactiveMessage: proto.Message.InteractiveMessage.create({
contextInfo: { 
mentionedJid: [m.sender], 
externalAdReply: {
showAdAttribution: true }
}, body: proto.Message.InteractiveMessage.Body.create({ 
text: teksnya
}), 
footer: proto.Message.InteractiveMessage.Footer.create({ 
text: global.foother
}), 
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ 
buttons: [{
"name": "single_select",
"buttonParamsJson": `{ "title": "Pilih Ram Panel", "sections": [{ "title": "# Silahkan Pilih Salah Satu Di Bawah ini pilih sesuai keinginan kamu sayang", "highlight_label": \"Powered By ${namaowner}\", "rows": [{ "header": "Ram Unlimited", "title": "Ram Unlimited | CPU Unlimited", "id": ".cpunli" }, 
{ "header": "Ram 1GB", "title": "Ram 1GB | CPU 40%", "id": ".cp1gb" }, 
{ "header": "Ram 2GB", "title": "Ram 2GB | CPU 60%", "id": ".cp2gb" }, 
{ "header": "Ram 3GB", "title": "Ram 3GB | CPU 80%", "id": ".cp3gb" }, 
{ "header": "Ram 4GB", "title": "Ram 4GB | CPU 100%", "id": ".cp4gb" }, 
{ "header": "Ram 5GB", "title": "Ram 5GB | CPU 120%", "id": ".cp5gb" }, 
{ "header": "Ram 6GB", "title": "Ram 6GB | CPU 140%", "id": ".cp6gb" }, 
{ "header": "Ram 7GB", "title": "Ram 7GB | CPU 160%", "id": ".cp7gb" }, 
{ "header": "Ram 8GB", "title": "Ram 8GB | CPU 180%", "id": ".cp8gb" }, 
{ "header": "Ram 9GB", "title": "Ram 9GB | CPU 200%", "id": ".cp9gb" }, 
{ "header": "Ram 10GB", "title": "Ram 10GB | CPU 220%", "id": ".cp10gb" }]}]}`
}]
})
})} 
}}, {userJid: m.sender, quoted: qchanel}) 
await kzm.relayMessage(msgii.key.remoteJid, msgii.message, { 
messageId: msgii.key.id 
})
}
break
case "cpanel2": case "addpanel2": case "buatpanel2": {
if (!isCreator && !isReseller) return kzmReply(msg.owner)
if (global.apikey.length < 1) return m.reply("Apikey Tidak Ditemukan!")
global.tempuser = crypto.randomBytes(3).toString('hex')
global.temppw = crypto.randomBytes(4).toString('hex')
let teksnya = "Silahkan Pilih Ram Server Panel, Username & Password Panel Akan Dibuat Secara Otomatis Oleh Bot"
let msgii = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { 
"messageContextInfo": { 
"deviceListMetadata": {}, 
"deviceListMetadataVersion": 2
}, 
interactiveMessage: proto.Message.InteractiveMessage.create({
contextInfo: { 
mentionedJid: [m.sender], 
externalAdReply: {
showAdAttribution: true }
}, body: proto.Message.InteractiveMessage.Body.create({ 
text: teksnya
}), 
footer: proto.Message.InteractiveMessage.Footer.create({ 
text: global.foother
}), 
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ 
buttons: [{
"name": "single_select",
"buttonParamsJson": `{ "title": "Pilih Ram Panel", "sections": [{ "title": "# Silahkan Pilih Salah Satu Di Bawah Ini", "highlight_label": \"Powered By ${namaowner}\", "rows": [{ "header": "Ram Unlimited", "title": "Ram Unlimited | CPU Unlimited", "id": ".cpunliv2" }, 
{ "header": "Ram 1GB", "title": "Ram 1GB | CPU 40%", "id": ".cp1gbv2" }, 
{ "header": "Ram 2GB", "title": "Ram 2GB | CPU 60%", "id": ".cp2gbv2" }, 
{ "header": "Ram 3GB", "title": "Ram 3GB | CPU 80%", "id": ".cp3gbv2" }, 
{ "header": "Ram 4GB", "title": "Ram 4GB | CPU 100%", "id": ".cp4gbv2" }, 
{ "header": "Ram 5GB", "title": "Ram 5GB | CPU 120%", "id": ".cp5gbv2" }, 
{ "header": "Ram 6GB", "title": "Ram 6GB | CPU 140%", "id": ".cp6gbv2" }, 
{ "header": "Ram 7GB", "title": "Ram 7GB | CPU 160%", "id": ".cp7gbv2" }, 
{ "header": "Ram 8GB", "title": "Ram 8GB | CPU 180%", "id": ".cp8gbv2" }, 
{ "header": "Ram 9GB", "title": "Ram 9GB | CPU 200%", "id": ".cp9gbv2" }, 
{ "header": "Ram 10GB", "title": "Ram 10GB | CPU 220%", "id": ".cp10gbv2" }]}]}`
}]
})
})} 
}}, {userJid: m.sender, quoted: qchanel}) 
await kzm.relayMessage(msgii.key.remoteJid, msgii.message, { 
messageId: msgii.key.id 
})
}
break
case "cpanel3": case "addpanel3": case "buatpanel3": {
if (!isCreator && !isReseller) return kzmReply(msg.owner)
if (global.apikey.length < 1) return m.reply("Apikey Tidak Ditemukan!")
if (!args[0]) return m.reply(example("nama,6283XXX"))
if (!text.split(",")) return m.reply(example("nama,6283XXX"))
var buyyer = text.split(",")[0].toLowerCase()
if (!buyyer) return m.reply(example("nama,6283XXX"))
var ceknya = text.split(",")[1]
if (!ceknya) return m.reply(example("nama,6283XXX"))
var client = text.split(",")[1].replace(/[^0-9]/g, '')+'@s.whatsapp.net'
var check = await kzm.onWhatsApp(ceknya)
if (!check[0].exists) return m.reply("Nomor Buyyer Tidak Valid!")
global.panel3 = [buyyer, client]
let teksnya = "Silahkan Pilih Ram Server Panel"
let msgii = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { 
"messageContextInfo": { 
"deviceListMetadata": {}, 
"deviceListMetadataVersion": 2
}, 
interactiveMessage: proto.Message.InteractiveMessage.create({
contextInfo: { 
mentionedJid: [m.sender], 
externalAdReply: {
showAdAttribution: true }
}, body: proto.Message.InteractiveMessage.Body.create({ 
text: teksnya
}), 
footer: proto.Message.InteractiveMessage.Footer.create({ 
text: global.foother
}), 
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ 
buttons: [{
"name": "single_select",
"buttonParamsJson": `{ "title": "Pilih Ram Panel", "sections": [{ "title": "# Silahkan Pilih Salah Satu Di Bawah Ini", "highlight_label": \"Powered By ${namaowner}\", "rows": [{ "header": "Ram Unlimited", "title": "Ram Unlimited | CPU Unlimited", "id": ".cpunliv3" }, 
{ "header": "Ram 1GB", "title": "Ram 1GB | CPU 40%", "id": ".cp1gbv3" }, 
{ "header": "Ram 2GB", "title": "Ram 2GB | CPU 60%", "id": ".cp2gbv3" }, 
{ "header": "Ram 3GB", "title": "Ram 3GB | CPU 80%", "id": ".cp3gbv3" }, 
{ "header": "Ram 4GB", "title": "Ram 4GB | CPU 100%", "id": ".cp4gbv3" }, 
{ "header": "Ram 5GB", "title": "Ram 5GB | CPU 120%", "id": ".cp5gbv3" }, 
{ "header": "Ram 6GB", "title": "Ram 6GB | CPU 140%", "id": ".cp6gbv3" }, 
{ "header": "Ram 7GB", "title": "Ram 7GB | CPU 160%", "id": ".cp7gbv3" }, 
{ "header": "Ram 8GB", "title": "Ram 8GB | CPU 180%", "id": ".cp8gbv3" }, 
{ "header": "Ram 9GB", "title": "Ram 9GB | CPU 200%", "id": ".cp9gbv3" }, 
{ "header": "Ram 10GB", "title": "Ram 10GB | CPU 220%", "id": ".cp10gbv3" }]}]}`
}]
})
})} 
}}, {userJid: m.sender, quoted: qchanel}) 
await kzm.relayMessage(msgii.key.remoteJid, msgii.message, { 
messageId: msgii.key.id 
})
}
break
case "cp1gbv2": case "cp2gbv2": case "cp3gbv2": case "cp4gbv2": case "cp5gbv2": case "cp6gbv2": case "cp7gbv2": case "cp8gbv2": case "cp9gbv2": case "cp10gbv2": case "cpunliv2": {
if (global.tempuser == null) return m.reply('Nama/Username Tidak Di Temukan')
var ram
var disknya
var cpu
if (command == "cp1gbv2") {
ram = "1125"
disknya = "1125"
cpu = "40"
} else if (command == "cp2gbv2") {
ram = "2125"
disknya = "2125"
cpu = "60"
} else if (command == "cp3gbv2") {
ram = "3125"
disknya = "3125"
cpu = "80"
} else if (command == "cp4gbv2") {
ram = "4125"
disknya = "4125"
cpu = "100"
} else if (command == "cp5gbv2") {
ram = "5125"
disknya = "5125"
cpu = "120"
} else if (command == "cp6gbv2") {
ram = "6125"
disknya = "6125"
cpu = "140"
} else if (command == "cp7gbv2") {
ram = "7125"
disknya = "7125"
cpu = "160"
} else if (command == "cp8gbv2") {
ram = "8125"
disknya = "8125"
cpu = "180"
} else if (command == "cp9gbv2") {
ram = "9124"
disknya = "9125"
cpu = "200"
} else if (command == "cp10gbv2") {
ram = "10125"
disknya = "10125"
cpu = "220"
} else {
ram = "0"
disknya = "0"
cpu = "0"
}
if (!isCreator && !isReseller) return kzmReply(msg.owner)
let username = global.tempuser.toLowerCase()
let email = username+"@gmail.com"
let name = capital(username)
let password = global.temppw
let f = await fetch(domain + "/api/application/users", {
"method": "POST",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
},
"body": JSON.stringify({
"email": email,
"username": username.toLowerCase(),
"first_name": name,
"last_name": "Server",
"language": "en",
"password": password.toString()
})
})
let data = await f.json();
if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2))
let user = data.attributes
let desc = tanggal(Date.now())
let usr_id = user.id
let f1 = await fetch(domain + "/api/application/nests/5/eggs/" + egg, {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
}
})
let data2 = await f1.json();
let startup_cmd = data2.attributes.startup
let f2 = await fetch(domain + "/api/application/servers", {
"method": "POST",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey,
},
"body": JSON.stringify({
"name": name,
"description": desc,
"user": usr_id,
"egg": parseInt(egg),
"docker_image": "ghcr.io/parkervcp/yolks:nodejs_18",
"startup": startup_cmd,
"environment": {
"INST": "npm",
"USER_UPLOAD": "0",
"AUTO_UPDATE": "0",
"CMD_RUN": "npm start"
},
"limits": {
"memory": ram,
"swap": 0,
"disk": disknya,
"io": 500,
"cpu": cpu
},
"feature_limits": {
"databases": 5,
"backups": 5,
"allocations": 5
},
deploy: {
locations: [parseInt(loc)],
dedicated_ip: false,
port_range: [],
},
})
})
let result = await f2.json()
if (result.errors) return m.reply(JSON.stringify(result.errors[0], null, 2))
let server = result.attributes
var orang
if (isGroup) {
orang = m.sender
await m.reply("*Berhasil Membuat Akun Panel ✅*\nData Akun Sudah Dikirim Ke Private Chat")
} else {
orang = m.chat
}
var teks = `
*Berhasil Membuat Akun Panel ✅*

* *ID :* ${server.id}
* *Nama :* ${name}
* *Ram :* ${ram == "0" ? "Unlimited" : ram.charAt(0) + "GB"}
* *CPU :* ${cpu == "0" ? "Unlimited" : cpu+"%"}
* *Storage :* ${disknya == "0" ? "Unlimited" : disknya.charAt(0) + "GB"}
* *Created :* ${desc}

`
let msgii = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { 
"messageContextInfo": { 
"deviceListMetadata": {}, 
"deviceListMetadataVersion": 2
}, 
interactiveMessage: proto.Message.InteractiveMessage.create({
contextInfo: { 
mentionedJid: [m.sender], 
externalAdReply: {
showAdAttribution: true }
}, body: proto.Message.InteractiveMessage.Body.create({ 
text: teks
}), 
footer: proto.Message.InteractiveMessage.Footer.create({ 
text: global.foother
}), 
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ 
buttons: [{
"name": "cta_url",
"buttonParamsJson": `{\"display_text\":\"Login Server Panel\",\"url\":\"${global.domain}\",\"merchant_url\":\"https://www.google.com\"}`
}, 
{
"name": "cta_copy",
"buttonParamsJson": `{\"display_text\":\"Copy Username\",\"id\":\"123456789\",\"copy_code\":\"${user.username}\"}`
},
{
"name": "cta_copy",
"buttonParamsJson": `{\"display_text\":\"Copy Password\",\"id\":\"123456789\",\"copy_code\":\"${global.temppw.toString()}\"}`
}]
})
})} 
}}, {userJid: m.sender, quoted: qchanel}) 
await kzm.relayMessage(orang, msgii.message, { 
messageId: msgii.key.id 
})
global.tempuser = null
global.temppw = null
}
break
case "cp1gbv3": case "cp2gbv3": case "cp3gbv3": case "cp4gbv3": case "cp5gbv3": case "cp6gbv3": case "cp7gbv3": case "cp8gbv3": case "cp9gbv3": case "cp10gbv3": case "cpunliv3": {
if (global.panel3 == null) return m.reply('Nama/Username Tidak Di Temukan')
var ram
var disknya
var cpu
if (command == "cp1gbv3") {
ram = "1125"
disknya = "1125"
cpu = "40"
} else if (command == "cp2gbv3") {
ram = "2125"
disknya = "2125"
cpu = "60"
} else if (command == "cp3gbv3") {
ram = "3125"
disknya = "3125"
cpu = "80"
} else if (command == "cp4gbv3") {
ram = "4125"
disknya = "4125"
cpu = "100"
} else if (command == "cp5gbv3") {
ram = "5125"
disknya = "5125"
cpu = "120"
} else if (command == "cp6gbv3") {
ram = "6125"
disknya = "6125"
cpu = "140"
} else if (command == "cp7gbv3") {
ram = "7125"
disknya = "7125"
cpu = "160"
} else if (command == "cp8gbv3") {
ram = "8125"
disknya = "8125"
cpu = "180"
} else if (command == "cp9gbv3") {
ram = "9124"
disknya = "9125"
cpu = "200"
} else if (command == "cp10gbv3") {
ram = "10125"
disknya = "10125"
cpu = "220"
} else {
ram = "0"
disknya = "0"
cpu = "0"
}
if (!isCreator && !isReseller) return kzmReply(msg.owner)
let username = global.panel3[0].toLowerCase()
let email = username+"@gmail.com"
let name = capital(username)
let password = username+crypto.randomBytes(2).toString('hex')
let f = await fetch(domain + "/api/application/users", {
"method": "POST",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
},
"body": JSON.stringify({
"email": email,
"username": username.toLowerCase(),
"first_name": name,
"last_name": "Server",
"language": "en",
"password": password.toString()
})
})
let data = await f.json();
if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2))
let user = data.attributes
let desc = tanggal(Date.now())
let usr_id = user.id
let f1 = await fetch(domain + "/api/application/nests/5/eggs/" + egg, {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
}
})
let data2 = await f1.json();
let startup_cmd = data2.attributes.startup
let f2 = await fetch(domain + "/api/application/servers", {
"method": "POST",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey,
},
"body": JSON.stringify({
"name": name,
"description": desc,
"user": usr_id,
"egg": parseInt(egg),
"docker_image": "ghcr.io/parkervcp/yolks:nodejs_18",
"startup": startup_cmd,
"environment": {
"INST": "npm",
"USER_UPLOAD": "0",
"AUTO_UPDATE": "0",
"CMD_RUN": "npm start"
},
"limits": {
"memory": ram,
"swap": 0,
"disk": disknya,
"io": 500,
"cpu": cpu
},
"feature_limits": {
"databases": 5,
"backups": 5,
"allocations": 5
},
deploy: {
locations: [parseInt(loc)],
dedicated_ip: false,
port_range: [],
},
})
})
let result = await f2.json()
if (result.errors) return m.reply(JSON.stringify(result.errors[0], null, 2))
let server = result.attributes
await m.reply(`*Berhasil Membuat Akun Panel ✅*\nData Akun Sudah Dikirim Ke Nomor ${global.panel3[1].split('@')[0]}`)
var teks = `
*Berhasil Membuat Akun Panel ✅*

* *ID :* ${server.id}
* *Nama :* ${name}
* *Ram :* ${ram == "0" ? "Unlimited" : ram.charAt(0) + "GB"}
* *CPU :* ${cpu == "0" ? "Unlimited" : cpu+"%"}
* *Storage :* ${disknya == "0" ? "Unlimited" : disknya.charAt(0) + "GB"}
* *Created :* ${desc}
`
let msgii = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { 
"messageContextInfo": { 
"deviceListMetadata": {}, 
"deviceListMetadataVersion": 2
}, 
interactiveMessage: proto.Message.InteractiveMessage.create({
contextInfo: { 
mentionedJid: [m.sender], 
externalAdReply: {
showAdAttribution: true }
}, body: proto.Message.InteractiveMessage.Body.create({ 
text: teks
}), 
footer: proto.Message.InteractiveMessage.Footer.create({ 
text: global.foother
}), 
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ 
buttons: [{
"name": "cta_url",
"buttonParamsJson": `{\"display_text\":\"Login Server Panel\",\"url\":\"${global.domain}\",\"merchant_url\":\"https://www.google.com\"}`
}, 
{
"name": "cta_copy",
"buttonParamsJson": `{\"display_text\":\"Copy Username\",\"id\":\"123456789\",\"copy_code\":\"${user.username}\"}`
},
{
"name": "cta_copy",
"buttonParamsJson": `{\"display_text\":\"Copy Password\",\"id\":\"123456789\",\"copy_code\":\"${password.toString()}\"}`
}]
})
})} 
}}, {userJid: m.sender, quoted: qchanel}) 
await kzm.relayMessage(global.panel3[1], msgii.message, { 
messageId: msgii.key.id 
})
global.panel3 = null
}
break
case "cp1gb": case "cp2gb": case "cp3gb": case "cp4gb": case "cp5gb": case "cp6gb": case "cp7gb": case "cp8gb": case "cp9gb": case "cp10gb": case "cp11gb": case "cp12gb": case "cp13gb": case "cp14gb": case "cp15gb": case "cp16gb": case "cp17gb": case "cp18gb": case "cp19gb": case "cp20gb": case "cp21gb": case "cp22gb": case "cp23gb": case "cp24gb": case "cp25gb": case "cp26gb": case "cp27gb": case "cp28gb": case "cp29gb": case "cp30gb": case "cp31gb": case "cp32gb": case "cp33gb": case "cp34gb": case "cp35gb": case "cp36gb": case "cp37gb": case "cp38gb": case "cp39gb": case "cp40gb": case "cp41gb": case "cp42gb": case "cp43gb": case "cp44gb": case "cp45gb": case "cp46gb": case "cp47gb": case "cp48gb": case "cp49gb": case "cp50gb": case "cpunli": {
if (!isCreator && !isReseller) return kzmReply(msg.owner)
if (global.panel == null) return m.reply('Nama/Username Tidak Di Temukan')
var ram
var disknya
var cpu
if (command == "cp1gb") {
ram = "1125"
disknya = "1125"
cpu = "40"
} else if (command == "cp2gb") {
ram = "2125"
disknya = "2125"
cpu = "60"
} else if (command == "cp3gb") {
ram = "3125"
disknya = "3125"
cpu = "80"
} else if (command == "cp4gb") {
ram = "4125"
disknya = "4125"
cpu = "100"
} else if (command == "cp5gb") {
ram = "5125"
disknya = "5125"
cpu = "120"
} else if (command == "cp6gb") {
ram = "6125"
disknya = "6125"
cpu = "140"
} else if (command == "cp7gb") {
ram = "7125"
disknya = "7125"
cpu = "160"
} else if (command == "cp8gb") {
ram = "8125"
disknya = "8125"
cpu = "180"
} else if (command == "cp9gb") {
ram = "9124"
disknya = "9125"
cpu = "200"
} else if (command == "cp10gb") {
ram = "10125"
disknya = "10125"
cpu = "220"
} else if (command == "cp11gb") {
ram = "11125"
disknya = "11125"
cpu = "360"
} else if (command == "cp12gb") {
ram = "12125"
disknya = "12125"
cpu = "390"
} else if (command == "cp13gb") {
ram = "13125"
disknya = "13125"
cpu = "420"
} else if (command == "cp14gb") {
ram = "14125"
disknya = "14125"
cpu = "450"
} else if (command == "cp15gb") {
ram = "15125"
disknya = "15125"
cpu = "480"
} else if (command == "cp16gb") {
ram = "16125"
disknya = "16125"
cpu = "510"
} else if (command == "cp17gb") {
ram = "17125"
disknya = "17125"
cpu = "540"
} else if (command == "cp18gb") {
ram = "18125"
disknya = "18125"
cpu = "570"
} else if (command == "cp19gb") {
ram = "19125"
disknya = "19125"
cpu = "600"
} else if (command == "cp20gb") {
ram = "20125"
disknya = "20125"
cpu = "630"
} else if (command == "cp21gb") {
ram = "21125"
disknya = "21125"
cpu = "660"
} else if (command == "cp22gb") {
ram = "22125"
disknya = "22125"
cpu = "660"
} else if (command == "cp23gb") {
ram = "23125"
disknya = "23125"
cpu = "690"
} else if (command == "cp24gb") {
ram = "24125"
disknya = "24125"
cpu = "720"
} else if (command == "cp25gb") {
ram = "25125"
disknya = "25125"
cpu = "750"
} else if (command == "cp26gb") {
ram = "26125"
disknya = "26125"
cpu = "780"
} else if (command == "cp27gb") {
ram = "27125"
disknya = "27125"
cpu = "810"
} else if (command == "cp28gb") {
ram = "28125"
disknya = "28125"
cpu = "840"
} else if (command == "cp29gb") {
ram = "29125"
disknya = "29125"
cpu = "870"
} else if (command == "cp30gb") {
ram = "30125"
disknya = "30125"
cpu = "900"
} else if (command == "cp31gb") {
ram = "31125"
disknya = "31125"
cpu = "930"
} else if (command == "cp32gb") {
ram = "32125"
disknya = "32125"
cpu = "960"
} else if (command == "cp33gb") {
ram = "33125"
disknya = "33125"
cpu = "990"
} else if (command == "cp34gb") {
ram = "34125"
disknya = "34125"
cpu = "1020"
} else if (command == "cp35gb") {
ram = "35125"
disknya = "35125"
cpu = "1050"
} else if (command == "cp36gb") {
ram = "36125"
disknya = "35125"
cpu = "1080"
} else if (command == "cp37gb") {
ram = "37125"
disknya = "37125"
cpu = "1110"
} else if (command == "cp38gb") {
ram = "38125"
disknya = "38125"
cpu = "1240"
} else if (command == "cp39gb") {
ram = "39125"
disknya = "39125"
cpu = "1270"
} else if (command == "cp40gb") {
ram = "40125"
disknya = "40125"
cpu = "1200"
} else if (command == "cp41gb") {
ram = "41125"
disknya = "41125"
cpu = "1230"
} else if (command == "cp42gb") {
ram = "42125"
disknya = "42125"
cpu = "1260"
} else if (command == "cp43gb") {
ram = "43125"
disknya = "43125"
cpu = "1290"
} else if (command == "cp44gb") {
ram = "44125"
disknya = "44125"
cpu = "1320"
} else if (command == "cp45gb") {
ram = "45125"
disknya = "45125"
cpu = "1350"
} else if (command == "cp46gb") {
ram = "46125"
disknya = "46125"
cpu = "1380"
} else if (command == "cp47gb") {
ram = "47125"
disknya = "47125"
cpu = "1410"
} else if (command == "cp48gb") {
ram = "48125"
disknya = "48125"
cpu = "1440"
} else if (command == "cp49gb") {
ram = "49125"
disknya = "49125"
cpu = "1470"
} else if (command == "cp50gb") {
ram = "50125"
disknya = "50125"
cpu = "1500"
} else {
ram = "0"
disknya = "0"
cpu = "0"
}
if (!isCreator && !isReseller) return kzmReply(msg.owner)
let username = global.panel[0].toLowerCase()
let email = username+"@gmail.com"
let name = capital(username)
let password = username+crypto.randomBytes(2).toString('hex')
let f = await fetch(domain + "/api/application/users", {
"method": "POST",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
},
"body": JSON.stringify({
"email": email,
"username": username.toLowerCase(),
"first_name": name,
"last_name": "Server",
"language": "en",
"password": password.toString()
})
})
let data = await f.json();
if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2))
let user = data.attributes
let desc = tanggal(Date.now())
let usr_id = user.id
let f1 = await fetch(domain + "/api/application/nests/5/eggs/" + egg, {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
}
})
let data2 = await f1.json();
let startup_cmd = data2.attributes.startup
let f2 = await fetch(domain + "/api/application/servers", {
"method": "POST",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey,
},
"body": JSON.stringify({
"name": name,
"description": desc,
"user": usr_id,
"egg": parseInt(egg),
"docker_image": "ghcr.io/parkervcp/yolks:nodejs_18",
"startup": startup_cmd,
"environment": {
"INST": "npm",
"USER_UPLOAD": "0",
"AUTO_UPDATE": "0",
"CMD_RUN": "npm start"
},
"limits": {
"memory": ram,
"swap": 0,
"disk": disknya,
"io": 500,
"cpu": cpu
},
"feature_limits": {
"databases": 5,
"backups": 5,
"allocations": 5
},
deploy: {
locations: [parseInt(loc)],
dedicated_ip: false,
port_range: [],
},
})
})
let result = await f2.json()
if (result.errors) return m.reply(JSON.stringify(result.errors[0], null, 2))
let server = result.attributes
var orang
if (isGroup) {
orang = m.sender
await m.reply("*Berhasil Membuat Akun Panel ✅*\nData Akun Sudah Dikirim Ke Private Chat")
} else {
orang = m.chat
}
var teks = `
*Berhasil Membuat Akun Panel ✅*

* *ID :* ${server.id}
* *Nama :* ${name}
* *Ram :* ${ram == "0" ? "Unlimited" : ram.charAt(0) + "GB"}
* *CPU :* ${cpu == "0" ? "Unlimited" : cpu+"%"}
* *Storage :* ${disknya == "0" ? "Unlimited" : disknya.charAt(0) + "GB"}
* *Created :* ${desc}
`
let msgii = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { 
"messageContextInfo": { 
"deviceListMetadata": {}, 
"deviceListMetadataVersion": 2
}, 
interactiveMessage: proto.Message.InteractiveMessage.create({
contextInfo: { 
mentionedJid: [m.sender], 
externalAdReply: {
showAdAttribution: true }
}, body: proto.Message.InteractiveMessage.Body.create({ 
text: teks
}), 
footer: proto.Message.InteractiveMessage.Footer.create({ 
text: global.foother
}), 
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ 
buttons: [{
"name": "cta_url",
"buttonParamsJson": `{\"display_text\":\"Login Server Panel\",\"url\":\"${global.domain}\",\"merchant_url\":\"https://www.google.com\"}`
}, 
{
"name": "cta_copy",
"buttonParamsJson": `{\"display_text\":\"Copy Username\",\"id\":\"123456789\",\"copy_code\":\"${user.username}\"}`
},
{
"name": "cta_copy",
"buttonParamsJson": `{\"display_text\":\"Copy Password\",\"id\":\"123456789\",\"copy_code\":\"${password.toString()}\"}`
}]
})
})} 
}}, {userJid: m.sender, quoted: qchanel}) 
await kzm.relayMessage(orang, msgii.message, { 
messageId: msgii.key.id 
})
global.panel = null
}
break
case "listpanel": case "listp": case "listserver": {
if (global.apikey.length < 1) return m.reply("Apikey Tidak Ditemukan!")
if (!isCreator) return kzmReply(msg.owner)
let f = await fetch(domain + "/api/application/servers?page=1", {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
}
});
let res = await f.json();
let servers = res.data;
if (servers.length < 1) return m.reply("Tidak Ada Server Bot")
let messageText = "*LIST SERVER PANEL BOT⚡*\n\n"
for (let server of servers) {
let s = server.attributes
let f3 = await fetch(domain + "/api/client/servers/" + s.uuid.split`-`[0] + "/resources", {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + capikey
}
})
let data = await f3.json();
let status = data.attributes ? data.attributes.current_state : s.status;
messageText += `\`📡ID Server ${s.id}\`
* Nama Server : *${s.name}*
* Ram : *${s.limits.memory == 0 ? "Unlimited" : s.limits.memory.length > 3 ? s.limits.memory.toString().charAt(1) + "GB" : s.limits.memory.toString().charAt(0) + "GB"}*
* CPU : *${s.limits.cpu == 0 ? "Unlimited" : s.limits.cpu.toString() + "%"}*
* Storage : *${s.limits.disk == 0 ? "Unlimited" : s.limits.disk.length > 3 ? s.limits.disk.toString().charAt(1) + "GB" : s.limits.disk.toString().charAt(0) + "GB"}*
* Created : ${s.created_at.split("T")[0]}\n\n`
}

messageText += ` Total Server : *${res.meta.pagination.count} Server*`;
  
  await kzm.sendMessage(m.chat, { text: messageText }, { quoted: qtoko })
}
break
case "delpanel": case "hapuspanel": {
if (!isCreator) return kzmReply(msg.owner)
if (global.apikey.length < 1) return m.reply("Apikey Tidak Ditemukan!")
if (!args[0]) return m.reply(example("idservernya\n\nuntuk melihat id server ketik *.listpanel*"))
let f = await fetch(domain + "/api/application/servers?page=1", {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
}
})
let result = await f.json()
let servers = result.data
let sections = []
for (let server of servers) {
let s = server.attributes
if (args[0] == s.id.toString()) {
sections.push(s.name.toLowerCase())
let f = await fetch(domain + `/api/application/servers/${s.id}`, {
"method": "DELETE",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey,
}
})
let res = f.ok ? {
errors: null
} : await f.json()
}}
let cek = await fetch(domain + "/api/application/users?page=1", {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
}
})
let res2 = await cek.json();
let users = res2.data;
for (let user of users) {
let u = user.attributes
if (sections.includes(u.username)) {
let delusr = await fetch(domain + `/api/application/users/${u.id}`, {
"method": "DELETE",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
}
})
let res = delusr.ok ? {
errors: null
} : await delusr.json()
}}
if (sections.length == 0) return m.reply("*ID Server/User* Tidak Ditemukan")
m.reply(`Berhasil Menghapus Akun Panel *${capital(sections[0])}*`)
}
break

default:
if (budy.startsWith('=>')) {
if (!isCreator) return
function Return(sul) {
sat = JSON.stringify(sul, null, 2)
bang = util.format(sat)
if (sat == undefined) {
bang = util.format(sul)
}
return m.reply(bang)
}
try {
m.reply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
} catch (e) {
m.reply(String(e))
}
}

if (budy.startsWith('>')) {
if (!isCreator) return
let kode = budy.trim().split(/ +/)[0]
let teks
try {
teks = await eval(`(async () => { ${kode == ">>" ? "return" : ""} ${q}})()`)
} catch (e) {
teks = e
} finally {
await m.reply(require('util').format(teks))
}
}

if (budy.startsWith('$')) {
if (!isCreator) return
exec(budy.slice(2), (err, stdout) => {
if (err) return m.reply(`${err}`)
if (stdout) return m.reply(stdout)
})
}
}

} catch (err) {
console.log(util.format(err))
}
}


let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})
