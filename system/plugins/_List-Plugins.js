require("./system/config")
const fs = require("fs");

const handler = async (m, { reply }) => {
try {
const Plugin = await fs.readdirSync("./system/Plugins")
if (Plugin.length < 1) return reply("Tidak ada file plugin")
let teks = `\nTotal file plugins: ${Plugin.length}\n\n`
for (let i of Plugin) {
teks += `- ${i}\n`
}
return m.reply(teks)
} catch (err) {
console.log(err)
}
}

handler.command = ["listplugin", "listp", "listplugins"]
handler.tags = ["owner"]
module.exports = handler