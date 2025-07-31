const Users = require('../../../../database/models/users');
const { Guilds } = require('../../../../database/models/guilds');

module.exports = {
  id: 'equipColorConfirm',
  run: async ({ client, interaction }) => {
    const position = interaction.fields.getTextInputValue('colorPosition');
    const index = parseInt(position) - 1;

    const guildDb = await Guilds.findById(interaction.guild.id);
    const userdb = await Users.findById(interaction.user.id);
    if (
      !userdb ||
      !userdb.colorsInventory ||
      userdb.colorsInventory.length === 0
    ) {
      return interaction.reply({
        content: client.formatEmoji(
          '#e:errado Você não possui nenhuma cor em seu inventário. zZz'
        ),
        flags: ['Ephemeral'],
      });
    }

    const ownedColors = guildDb.colors.filter((cor) =>
      userdb.colorsInventory.includes(cor.id)
    );
    const selectedColor = ownedColors[index];

    if (!selectedColor) {
      return interaction.reply({
        content: client.formatEmoji(
          '#e:errado Posição inválida! Verifique seu inventário novamente.'
        ),
        flags: ['Ephemeral'],
      });
    }

    const member = interaction.member;

    const rolesToRemove = member.roles.cache.filter((r) =>
      userdb.colorsInventory.includes(r.id)
    );
    if (rolesToRemove.size > 0) await member.roles.remove(rolesToRemove);

    await member.roles.add(selectedColor.id);

    userdb.equippedColor = selectedColor.id;
    userdb.save();

    interaction.reply({
      content: client.formatEmoji(
        `#e:correto Você equipou a cor <@&${selectedColor.id}> com sucesso!`
      ),
      flags: ['Ephemeral'],
    });
  },
};
