const Discord = require('discord.js');

module.exports = {
    name: 'criar_cargos',
    description: 'criar cargos :D',
    devOnly: true,
    category: 'moderation',
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'referencia',
            description: 'Os novos cargos ficarão abaixo desse',
            type: Discord.ApplicationCommandOptionType.Role,
            required: true
        },
        {
            name: 'nomes',
            description: 'Nomes dos cargos separados por vírgula',
            type: Discord.ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const referenceRole = interaction.options.getRole('referencia');
        const roleNames = interaction.options.getString('nomes').split(',').map(name => name.trim()).filter(name => name);

        if (roleNames.length === 0) {
            return interaction.editReply({
                content: client.formatEmoji('#e:errado Você deve fornecer pelo menos um nome de cargo válido!'),
                ephemeral: true
            });
        }

        try {
            const referencePosition = referenceRole.position;
            const createdRoles = [];

            for (let i = roleNames.length - 1; i >= 0; i--) {
                const name = roleNames[i];
                const newRole = await interaction.guild.roles.create({
                    name: name,
                    position: referencePosition,
                    reason: `Criado por ${interaction.user.tag} via comando`
                });
                createdRoles.unshift(newRole);
            }

            await interaction.editReply({
                content: client.formatEmoji(`#e:correto **${createdRoles.length} cargos criados** com sucesso abaixo de ${referenceRole}:\n${createdRoles.map(r => `• ${r}`).join('\n')}`),
                ephemeral: true
            });

        } catch (error) {
            console.error('Erro ao criar cargos:', error);
            await interaction.editReply({
                content: client.formatEmoji('#e:errado Ocorreu um erro ao criar os cargos.\n -# **Verifique:**\n- Minhas permissões\n- Nomes válidos\n- Limite de cargos do servidor'),
                ephemeral: true
            });
        }
    }
};