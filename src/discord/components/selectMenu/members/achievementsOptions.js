const Users = require('../../../../database/models/users');
const { k } = require('kompozr');

module.exports = {
  id: 'achievementsOptions',
  authorOnly: true,
  run: async ({ client, interaction, args }) => {
    const userDB = await Users.findOne({ _id: interaction.user.id });
    const achievement = userDB.achievements.map(
      (x) =>
        `> ${x.name}\n-# - ${x.description}\n-# **Desbloqueada: <t:${Math.floor(
          x.unlockedAt / 1000
        )}:R>**`
    );
    const values = interaction.values[0];
    console.log(values);
    const category = userDB.achievements.filter((x) => x.category === values);

    const text = category.map(
      (x) =>
        `**${x.name}**\n> - ${x.description}\n-# **Debloquado <t:${Math.floor(
          x.unlockedAt / 1000
        )}:R>**`
    );

    console.log(category.length);
    const container = k.container({
      components: [
        k.text(
          client.formatEmoji(
            `## #e:estrela ${values.toUpperCase()}\n-# Conquistas\n${text.length <= 0 ? `- Você ainda não possui nenhuma conquista dessa categoria :C\n -# Deveria explorar mais um pouco do servidor ZzzZ` : text.join(
              '\n\n'
            )}`
          )
        ),
      ],
      color: 0x606c38,
    });

    const selectMenu = interaction.message.components[1];

    interaction.update({
      components: [container, selectMenu],
      flags: ['IsComponentsV2', ['Ephemeral']],
    });
  },
};
