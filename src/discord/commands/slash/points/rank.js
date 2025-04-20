const Discord = require('discord.js');
const User = require('../../../../database/models/users');

module.exports = {
    name: 'rank',
    description: 'Veja o ranking dos viajantes com mais pontos.',
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'página',
            description: 'Informe o número da página que você deseja visualizar.',
            type: Discord.ApplicationCommandOptionType.Integer,
            required: false
        }
    ],

    run: async (client, interaction) => {
        const page = interaction.options.getInteger('página') || 1;
        const itemsPerPage = 5;

        const getRankingPage = async (page) => {
            const skip = (page - 1) * itemsPerPage;
            const allUsers = await User.find({ points: { $gt: 0 } }).sort({ points: -1 }).skip(skip).limit(itemsPerPage);
            const totalUsers = await User.countDocuments({ points: { $gt: 0 } });
            const totalPages = Math.ceil(totalUsers / itemsPerPage);

            let desc = `## CDM - Ranking de Pontos\n\n`;

            for (const [index, user] of allUsers.entries()) {
                const rank = skip + index + 1;
                let member = interaction.guild.members.cache.get(user._id);

                if (!member) {
                    try {
                        member = await client.users.fetch(user._id);
                    } catch (err) {
                        member = null;
                    }
                }

                let username = member?.tag || member?.user?.tag || "Usuário Desconhecido";
                if (rank === 1 && page === 1) username += client.formatEmoji(' #coroa');

                desc += client.formatEmoji(`\`#${rank}\` - **${username}**\n-# - **${user.points.toLocaleString()} pontos**\n`);
            }

            const embed = new Discord.EmbedBuilder()
                .setDescription(desc)
                .setColor('#2f3136')
                .setFooter({ text: `Página ${page} de ${totalPages}` });

            const row = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`rank:${interaction.user.id}:prev:${page}`)
                    .setLabel('Anterior')
                    .setEmoji(client.formatEmoji('#left'))
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setDisabled(page === 1),

                new Discord.ButtonBuilder()
                    .setCustomId(`rank:${interaction.user.id}:next:${page}`)
                    .setLabel('Próximo')
                    .setEmoji(client.formatEmoji('#right'))
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setDisabled(page === totalPages)
            );

            return { embed, row };
        };

        try {
            const { embed, row } = await getRankingPage(page);
            await interaction.reply({ embeds: [embed], components: [row] });
        } catch (error) {
            console.error(`Erro ao buscar ranking:`, error);
            return interaction.reply({ content: 'Eitaaa, houve um erro ao carregar o ranking.', ephemeral: true });
        }
    }
};
