const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    id: 'buyColor',
    authorOnly: false,
    run: async ({ client, interaction }) => {
        const colorPosition = new ActionRowBuilder().addComponents(
            new TextInputBuilder()
                .setCustomId('color-position')
                .setLabel('Digite a posição da cor que deseja comprar')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
        )

        const modal = new ModalBuilder()
            .setCustomId(`colorPurchase:${interaction.user.id}`)
            .setTitle('Comprar Cor')
            .addComponents(colorPosition);


        await interaction.showModal(modal);
    }
}