const { EmbedBuilder } = require('discord.js');
const { Guilds } = require('../../../../database/models/guilds');

module.exports = {
  id: 'colorCatalog',
  authorOnly: false,
  run: async ({ client, interaction }) => {
    const guildDb = await Guilds.findById(interaction.guild.id);
    if (!guildDb?.colors?.length) {
      return interaction.reply({
        content: client.formatEmoji(
          '#e:errado Nenhuma cor registrada na loja.'
        ),
        ephemeral: true,
      });
    }

    const categorias = {
      c: { nome: 'C - 500 pontos - 70%', lista: [] },
      b: { nome: 'B - 1.500 pontos - 20%', lista: [] },
      a: { nome: 'A - 3.000 pontos - 9%', lista: [] },
      s: { nome: 'S - 5.000 pontos - 1%', lista: [] },
    };

    for (const cor of guildDb.colors) {
      const cargo = interaction.guild.roles.cache.get(cor.id);
      if (cargo) {
        categorias[cor.rarity]?.lista.push(`<@&${cargo.id}>`);
      }
    }

    const desc = Object.entries(categorias)
      .map(([_, { nome, lista }]) =>
        lista.length ? `-# **${nome}**\n> ${lista.join('\n> ')}\n` : ''
      )
      .join('\n');

    const embed = new EmbedBuilder()
      .setColor('#84764e')
      .setImage(
        'https://media.discordapp.net/attachments/1327425235716276322/1377736254447288410/23_Sem_Titulo_1.png'
      )
      .setDescription(
        `# Catálogo de Cores!\n${desc}` || '*Nenhuma cor registrada.*'
      );

    return interaction.reply({
      embeds: [embed],
      flags: ['Ephemeral'],
    });
  },
};
