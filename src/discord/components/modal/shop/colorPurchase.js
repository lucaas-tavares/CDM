const { Guilds } = require('../../../../database/models/guilds');
const checkAchievements = require('../../../../functions/module/achievements/checkAchievements');

module.exports = {
  id: 'colorPurchase',
  run: async ({ client, interaction, userdb }) => {
    const position = interaction.fields.getTextInputValue('color-position');
    const index = parseInt(position) - 1;

    const guildDb = await Guilds.findById(interaction.guild.id);
    const chosenColor = guildDb?.availableColors?.[index];

    if (!chosenColor) {
      return interaction.reply({
        content: client.formatEmoji(
          '#e:errado Posição inválida!\n-# Tente novamente!'
        ),
        flags: ['Ephemeral'],
      });
    }

    if (userdb.colorsInventory?.includes(chosenColor.id)) {
      return interaction.reply({
        content: client.formatEmoji(
          `#e:errado Você **já possui essa cor** no seu inventário.\n-# Para equipá-la, use o comando \`/inventario\`.`
        ),
        flags: ['Ephemeral'],
      });
    }

    if (userdb.points < chosenColor.price) {
      return interaction.reply({
        content: client.formatEmoji(
          `#e:errado Você não tem pontos suficientes para comprar esta cor.\n-# Faltam [ ${
            chosenColor.price - userdb.points
          } pontos ]`
        ),
        flags: ['Ephemeral'],
      });
    }

    if (!userdb.colorsInventory?.includes(chosenColor.id)) {
      userdb.colorsInventory = [
        ...(userdb.colorsInventory || []),
        chosenColor.id,
      ];
    }

    userdb.equippedColor = chosenColor.id;
    userdb.points -= chosenColor.price;
    await userdb.save();

    const role = interaction.guild.roles.cache.get(chosenColor.id);
    if (!role) {
      return interaction.reply({
        content: client.formatEmoji(
          '#e:errado O cargo da cor selecionada não foi encontrado!'
        ),
        flags: ['Ephemeral'],
      });
    }

    const userColorRoles = interaction.member.roles.cache.filter((r) =>
      guildDb.colors.some((c) => c.id === r.id)
    );

    if (userColorRoles.size > 0) {
      await interaction.member.roles
        .remove(userColorRoles.map((r) => r.id))
        .catch(() => {});
    }

    await interaction.member.roles.add(role).catch(() => {});
    await checkAchievements(
      interaction.user.id,
      client,
      interaction,
      'color_purchase'
    );

    if (interaction.deferred || interaction.replied) {
      return interaction.followUp({
        content:
          client.formatEmoji(
            `#e:correto Você **comprou com sucesso** a cor <@&${chosenColor.id}>!`
          ) +
          (userColorRoles.size > 0
            ? `\n-# A cor antiga ${userColorRoles
                .map((r) => `<@&${r.id}>`)
                .join(', ')} foi desativada.`
            : '') +
          `\n-# Visualize suas cores compradas com \`/inventario\``,
        flags: ['Ephemeral'],
      });
    } else {
      return interaction.reply({
        content:
          client.formatEmoji(
            `#e:correto Você **comprou com sucesso** a cor <@&${chosenColor.id}>!`
          ) +
          (userColorRoles.size > 0
            ? `\n-# A cor antiga ${userColorRoles
                .map((r) => `<@&${r.id}>`)
                .join(', ')} foi desativada.`
            : '') +
          `\n-# Visualize suas cores compradas com \`/inventario\``,
        flags: ['Ephemeral'],
      });
    }
  },
};
