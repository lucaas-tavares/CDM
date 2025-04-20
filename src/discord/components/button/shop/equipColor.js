const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  id: 'equipColor',
  run: async ({ interaction }) => {
    const modal = new ModalBuilder()
      .setCustomId(`equipColorConfirm:${interaction.user.id}`)
      .setTitle('Equipar Cor');

    const input = new TextInputBuilder()
      .setCustomId('colorPosition')
      .setLabel('Digite a posição da cor que deseja equipar')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Ex: 1')
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(input);
    modal.addComponents(row);

    await interaction.showModal(modal);
  }
};
