const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const { colors } = require('../../../../data/outhers/SHOP_ROLES_ID.json');
const { Guildas } = require('../../../../database/models/guilds.js');

async function updatePanel(client, guildId) {
    const probabilities = { comum: 0.8, rara: 0.15, lendária: 0.05 };

    let guildData = await Guildas.findOneAndUpdate(
        { _id: guildId },
        { lastShopUpdate: Date.now() },
        { new: true, upsert: true }
    );

    function getRandomColors() {
        let availableColors = [];
        let attempts = 0;
        while (availableColors.length < 7 && attempts < 50) {
            attempts++;
            let selected = colors[Math.floor(Math.random() * colors.length)];
            let chance = Math.random();

            if (
                (selected.rarity === "comum" && chance < probabilities.comum) ||
                (selected.rarity === "rara" && chance < probabilities.rara) ||
                (selected.rarity === "lendária" && chance < probabilities.lendária)
            ) {
                if (!availableColors.some(color => color.id === selected.id)) {
                    availableColors.push(selected);
                }
            }
        }
        return availableColors;
    }

    const selectedColors = getRandomColors();
    const nextUpdate = Math.floor((Date.now() + 5 * 60 * 60 * 1000) / 1000);

    function generateShopMessage() {
        const colorList = selectedColors.map((color, index) =>
            `> ${index + 1}. <@&${color.id}>\n> -# Cor: **${color.rarity.charAt(0).toUpperCase() + color.rarity.slice(1)}** - Valor: [ \`${color.price}\` ]`
        ).join("\n");

        return `# CDM - Painel de cores\n> Abaixo estão todas as cores que estão __disponíveis__ para comprar __no momento__.\n`
            + `> - Lembre-se, as cores **atualizam** a cada **5 horas**!!!\n`
            + `> -# Cores novas **__<t:${nextUpdate}:R>__**!!!\n\n`
            + `-# **Cores disponíveis:**\n`
            + colorList + "\n\n"
            + `❓ - **Como realizar a compra?**\n`
            + `-# **Pressione** o botão abaixo e **digite a posição da cor** que deseja comprar!\n-# Aviso: Ao comprar uma nova cor, a cor antiga será removida!`;
    }

    const embed = new EmbedBuilder()
        .setDescription(generateShopMessage())
        .setColor("#5865f2");

    const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`buyColor:${guildId}`)
            .setLabel('Comprar Cor')
            .setEmoji('<a:yumeniko:1357194427977961502>')
            .setStyle(2)
    );

    try {
        const guild = await client.guilds.fetch(guildId);
        const channel = await guild.channels.fetch('1347926420785070080');

        if (guildData.lastShopMessageId) {
            channel.messages.fetch(guildData.lastShopMessageId)
                .then(msg => msg.delete())
                .catch(() => {});
        }

        const newMessage = await channel.send({ embeds: [embed], components: [button] });

        guildData.availableColors = selectedColors;
        guildData.lastShopMessageId = newMessage.id;
        await guildData.save();
    } catch (err) {
        console.log(`Erro - painel de cores: ${err}`);
    }

    setTimeout(() => updatePanel(client, guildId),  5 * 60 * 60 * 1000);
}

module.exports = {
    name: 'panel-colors',
    aliases: ['painelc'],
    description: '「shop」Painel de cores',
    category: "shop",
    run: async (client, message, args) => {
        let guildData = await Guildas.findOneAndUpdate(
            { _id: message.guild.id },
            { shopChannelId: message.channel.id, lastShopUpdate: Date.now() },
            { new: true, upsert: true }
        );

        updatePanel(client, message.guild.id);
        message.reply(":D");
    }
};
