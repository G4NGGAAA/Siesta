require("./system/config")
const fs = require("fs")

let handler = async (m, { kzm, isCreator, reply, text }) => {
if (!isCreator) return reply(global.mess.owner)
if (!text) return m.reply("namafile plugins nya")
if (!text.endsWith(".js")) return m.reply("Nama file harus berformat .js")
if (!fs.existsSync("./system/Plugins/" + text.toLowerCase())) return m.reply("File plugins tidak ditemukan!")
let res = await fs.readFileSync("./system/Plugins/" + text.toLowerCase())
return m.reply(`${res.toString()}`)
}

handler.command = ["getp", "gp", "getplugins", "getplugin"]
handler.tags =["owner"]
module.exports = handler