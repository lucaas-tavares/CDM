const Discord = require('discord.js');
const { colors } = require('../../../../data/outhers/SHOP_ROLES_ID.json');
const Membros = require('../../../../database/models/users');

module.exports = {
  name: 'inventario',
  description: 'Veja as cores que você possui',
  type: Discord.ApplicationCommandType.ChatInput,
  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const userdb = await Membros.findById(interaction.user.id);
    if (!userdb || !userdb.colorsInventory || userdb.colorsInventory.length === 0) {
      return interaction.editReply({ content: '🎨 Você ainda não possui nenhuma cor no inventário.' });
    }

    const userRoles = interaction.member.roles.cache;
    const colorInventory = colors.filter(c => userdb.colorsInventory.includes(c.id));
    const equipped = userRoles.find(r => userdb.colorsInventory.includes(r.id));

    const lista = colorInventory.map((cor, i) => {
      const atual = equipped && equipped.id === cor.id;
      return `${i + 1}. <@&${cor.id}> - __${cor.rarity.toLocaleUpperCase()}__${atual ? ' ← **\`Equipada\`**' : ''}`;
    }).join('\n');

    const embed = new Discord.EmbedBuilder()
      .setColor('#5865f2')
      .setDescription( client.formatEmoji(
        `## #pincel - Inventário de cores:\n\n${lista}\n\n-# **[📝] -** Clique no botão abaixo para equipar uma cor informando a posição.`)
      );

    const row = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder()
        .setCustomId(`equipColor:${interaction.user.id}`)
        .setLabel('Equipar Cor')
        .setEmoji(client.formatEmoji('#pincel'))
        .setStyle(Discord.ButtonStyle.Secondary)
    );

    interaction.editReply({ embeds: [embed], components: [row] });
  }
};
