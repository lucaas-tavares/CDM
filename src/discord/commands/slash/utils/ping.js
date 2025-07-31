const Discord = require('discord.js');

module.exports = {
    name:'ping',
    description:'Veja o ping',
    type: Discord.ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
      
        interaction.reply(`🏓** | Pong!** \`${client.ws.ping}ms\`.`);
    }
}