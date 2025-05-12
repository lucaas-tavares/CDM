const { ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'say',
    description: 'descrição',
    devOnly: true,
    category: 'categoria',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'string',
            description: 'informe algo',
            type: ApplicationCommandOptionType.String
        }
    ],
    run: async (client, interaction) => {
        const text = interaction.options.getString('string');
        const embed = new EmbedBuilder()
            .setDescription(`${text}`)
            .setColor('#2f3136')

        interaction.reply({ embeds: [embed] })

    }
}