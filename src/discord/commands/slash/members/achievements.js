const {
  ApplicationCommandType,
  ContainerBuilder,
  ComponentType,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require('discord.js');
const Users = require('../../../../database/models/users');

module.exports = {
  name: 'nome',
  description: 'descrição',
  devOnly: true,
  category: 'members',
  type: ApplicationCommandType.ChatInput,
  run: async (client, interaction) => {
    const userDB = await Users.findOne({ _id: interaction.user.id });

    if (userDB.achievements.length === 0) {
      interaction.reply({
        content: client.formatEmoji(
          '#e:errado Você não possui conquistas.\n-# Experimente comprar uma cor na loja de cores ou dar `/bump`.'
        ),
        flags: ['Ephemeral'],
      });
      return;
    }

    const achievement = userDB.achievements.map(
      (x) =>
        `> ${x.name}\n-# - ${x.description}\n-# **Desbloqueada: <t:${Math.floor(
          x.unlockedAt / 1000
        )}:R>**`
    );

    const container = new ContainerBuilder({
      accent_color: 0x606c38,
      components: [
        {
          content: client.formatEmoji(
            `## #e:estrela Todas as Conquistas: ${achievement.join('\n\n')}`
          ),
          type: ComponentType.TextDisplay,
        },
      ],
    });

    const selectMenu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`achievementsOptions:${interaction.user.id}`)
        .setPlaceholder('----- Selecione uma categoria -----')
        .addOptions([
          {
            label: 'Cores',
            description: 'Aqui suas conquistas referente às cores.',
            value: 'color',
          },
          {
            label: 'Bumps',
            description: 'Suas conquistas referente aos bumps.',
            value: 'bump',
          },
          {
            label: 'Especial',
            description: 'Conquistas se encontra conquistas especiais.',
            value: 'special',
          },
        ])
    );

    interaction.reply({
      components: [container, selectMenu],
      flags: ['Ephemeral', 'IsComponentsV2'],
    });
  },
};
