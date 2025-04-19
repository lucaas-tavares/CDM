const Discord = require('discord.js')

module.exports = {
    name:"ping",
    aliases:['pong'],
    description:'「Util」Veja o ping',
    category: "util",
    run: async (client, message) => {
        const button = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
            .setLabel('Recarregar')
            .setStyle(Discord.ButtonStyle.Success)
            .setCustomId(`test:${message.author.id}`)
        )
        message.reply({ content: `🏓** | Pong!** \`${client.ws.ping} ms\``, components: [button]});


    }
}