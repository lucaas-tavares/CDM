const {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} = require('discord.js');
const { Guilds } = require('../../../../database/models/guilds.js');

async function updatePanel(client, message, guildId) {
  const probabilities = {
    c: 0.7,
    b: 0.2,
    a: 0.09,
    s: 0.01,
  };

  let guildDb = await Guilds.findOneAndUpdate(
    { _id: guildId },
    { lastShopUpdate: Date.now() },
    { new: true, upsert: true }
  );

  function getRandomColors() {
    const raritiesLimit = {
      s: 1,
      a: 2,
    };

    const counts = {
      c: 0,
      b: 0,
      a: 0,
      s: 0,
    };

    const selected = [];
    const usedIds = new Set();
    let attempts = 0;

    while (selected.length < 7 && attempts < 100) {
      attempts++;
      const candidate =
        guildDb.colors[Math.floor(Math.random() * guildDb.colors.length)];
      if (!candidate || usedIds.has(candidate.id)) continue;

      const chance = Math.random();
      const rarity = candidate.rarity;

      if (chance > probabilities[rarity]) continue;

      if (rarity === 's') {
        if (counts.s >= raritiesLimit.s) continue;
        if (counts.a > 0) continue;
      }

      if (rarity === 'a') {
        if (counts.s > 0) continue;
        if (counts.a >= raritiesLimit.a) continue;
      }

      usedIds.add(candidate.id);
      selected.push(candidate);
      counts[rarity]++;
    }

    return selected;
  }

  const selectedColors = getRandomColors();
  const nextUpdate = Math.floor((Date.now() + 5 * 60 * 60 * 1000) / 1000);

  const colorList = selectedColors
    .map(
      (color, index) =>
        `> ${index + 1}. <@&${color.id}>\n> -# → Raridade: **${
          color.rarity.charAt(0).toUpperCase() + color.rarity.slice(1)
        }** ・ Pontos: [ \`${color.price}\` ]`
    )
    .join('\n');

  const embed = new EmbedBuilder()
    .setDescription(
      `
# CDM - Painel de cores
> -# - Abaixo estão todas as cores que estão __disponíveis__ no momento.
> ### Cores novas **__<t:${nextUpdate}:R>__**!!!
_ _
-# **Cores disponíveis:**\n ${colorList}
_ _
❓ - **Como realizar a compra?**
- **Pressione** o botão abaixo e **__digite a posição da cor__** que deseja comprar!
-# ❒ — Aviso: Ao comprar uma nova cor, a cor antiga será desativada! Para ativa-la novamente, utilize \`/inventario\`
`
    )
    .setImage(
      'https://media.discordapp.net/attachments/1327425235716276322/1377736254447288410/23_Sem_Titulo_1.png'
    )
    .setColor('#84764e');

  const button = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`buyColor:${guildId}`)
      .setLabel('Comprar Cor')
      .setEmoji('<a:yumeniko:1357194427977961502>')
      .setStyle(2),
       new ButtonBuilder()
      .setCustomId(`colorCatalog:${message.author.id}`)
      .setLabel('Catálogo de cores')
      .setEmoji('<:1poll:1327468894503305286>')
      .setStyle(2)
  );

  try {
    const guild = await client.guilds.fetch(guildId);
    const channel = await guild.channels.fetch('1347926420785070080');

    if (guildDb.lastShopMessageId) {
      channel.messages
        .fetch(guildDb.lastShopMessageId)
        .then((msg) => msg.delete())
        .catch(() => {});
    }

    const newMessage = await channel.send({
      embeds: [embed],
      components: [button],
    });

    guildDb.availableColors = selectedColors;
    guildDb.lastShopMessageId = newMessage.id;
    await guildDb.save();
  } catch (err) {
    console.log(`Erro - painel de cores: ${err}`);
  }

  setTimeout(() => updatePanel(client, message, guildId), 5 * 60 * 60 * 1000);
}

module.exports = {
  name: 'panel-color',
  aliases: ['painelc'],
  description: '「shop」Painel de cores',
  category: 'shop',
  devOnly: true,
  run: async (client, message, args) => {
    let guildDb = await Guilds.findOneAndUpdate(
      { _id: message.guild.id },
      { shopChannelId: message.channel.id, lastShopUpdate: Date.now() },
      { new: true, upsert: true }
    );

    updatePanel(client, message, message.guild.id);
    message.reply(':D').then((msg) => msg.delete());
  },
};
