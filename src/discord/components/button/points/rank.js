const Discord = require('discord.js');
const User = require('../../../../database/models/users');

module.exports = {
    id: 'rank',
    run: async ({ client, interaction, args }) => {
        const [userId, action, currentPage] = args;
        let page = parseInt(currentPage);

        if (!['prev', 'next'].includes(action) || isNaN(page)) {
            return interaction.reply({ content: 'Interação inválida.', ephemeral: true });
        }

        if (action === 'prev') page--;
        if (action === 'next') page++;

        const itemsPerPage = 5;
        const skip = (page - 1) * itemsPerPage;
        const totalUsers = await User.countDocuments({ points: { $gt: 0 } });
        const totalPages = Math.ceil(totalUsers / itemsPerPage);

        const allUsers = await User.find({ points: { $gt: 0 } }).sort({ points: -1 }).skip(skip).limit(itemsPerPage);
    
        let desc = client.formatEmoji(`## CDM - Ranking de Pontos\n\n`);

        for (const [index, user] of allUsers.entries()) {
            const rank = skip + index + 1;
            let member = interaction.guild.members.cache.get(user._id);
            if (!member) {
                try {
                    member = await client.users.fetch(user._id);
                } catch {
                    member = null;
                }
            }

            let username = member?.username || member?.user?.username || "Usuário Desconhecido";
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

        await interaction.update({ embeds: [embed], components: [row] });
    }
};
