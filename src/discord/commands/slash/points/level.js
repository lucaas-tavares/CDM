const Discord = require('discord.js');
const Users = require('../../../../database/models/users');

module.exports = {
    name: 'level',
    description: 'Visualize os pontos de um usuário e algumas informações úteis',
    type: Discord.ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        const user = interaction.user;

        try {
            const userData = await Users.findById(user.id);
            const xpMultiplier = 1.2;
            const baseXp = 1000;
            const nextLevelXp = Math.floor(baseXp * (userData.level ** xpMultiplier));

            interaction.reply({
                content: client.formatEmoji(`#e:correto ${user}, você está no nível **${userData.level}**!\n-# Sua quantia atual de XP é: \`[${userData.xp.toLocaleString()} / ${nextLevelXp.toLocaleString()}]\``),
                 flags: ['Ephemeral'],
            });
        } catch (err) {
            console.error(`[Erro] Level - ${err.message}`);
            interaction.reply({
                content: 'Ops... Houve um erro ao tentar buscar seus dados.\n- Que tal tentar novamente mais tarde?',
                 flags: ['Ephemeral'],
            });
        }
    }
};
