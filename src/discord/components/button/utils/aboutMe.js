const {
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  ModalBuilder,
} = require('discord.js');

module.exports = [
  {
    id: 'aboutMe',
    authorOnly: true,
    run: async ({ client, interaction, args }) => {
      const modal = new ModalBuilder()
        .setCustomId(`editField:${interaction.user.id}`)
        .setTitle('Edite seu perfil');

      const input = new TextInputBuilder()
        .setCustomId('fieldInput')
        .setLabel('Novo Sobre mim')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(260)
        .setRequired(false);

      const row = new ActionRowBuilder().addComponents(input);
      modal.addComponents(row);
      await interaction.showModal(modal);
    },
  },
];
