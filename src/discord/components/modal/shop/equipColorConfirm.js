const Membros = require('../../../../database/models/users');
const { colors } = require('../../../../data/outhers/SHOP_ROLES_ID.json');

module.exports = {
  id: 'equipColorConfirm',
  run: async ({ client, interaction }) => {
    const position = interaction.fields.getTextInputValue('colorPosition');
    const index = parseInt(position) - 1;

    const userdb = await Membros.findById(interaction.user.id);
    if (!userdb || !userdb.colorsInventory || userdb.colorsInventory.length === 0) {
      return interaction.reply({
        content: client.formatEmoji('#e:errado Você não possui nenhuma cor em seu inventário. zZz'),
        ephemeral: true
      });
    }

    const ownedColors = colors.filter(cor => userdb.colorsInventory.includes(cor.id));
    const selectedColor = ownedColors[index];

    if (!selectedColor) {
      return interaction.reply({
        content: client.formatEmoji('#e:errado Posição inválida! Verifique seu inventário novamente.'),
        ephemeral: true
      });
    }

    const member = interaction.member;

    const rolesToRemove = member.roles.cache.filter(r => userdb.colorsInventory.includes(r.id));
    if (rolesToRemove.size > 0) await member.roles.remove(rolesToRemove);

    await member.roles.add(selectedColor.id);

    interaction.reply({
      content: client.formatEmoji(`#e:correto Você equipou a cor <@&${selectedColor.id}> com sucesso!`),
      ephemeral: true
    });
  }
};
