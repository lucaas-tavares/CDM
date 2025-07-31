const { ApplicationCommandType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'finalizar',
    description: 'Fecha o post de ajuda atual',
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        if (!interaction.channel.isThread() || interaction.channel.ownerId !== interaction.user.id) {
            return interaction.reply({
                content: client.formatEmoji('#e:errado Apenas o autor pode finalizar este post!'),
                 flags: ['Ephemeral'],
            });
        }

        try {
            const embed = new EmbedBuilder()
                .setColor(0x6F4E37)
                .setDescription(`
## ⭐ ・ Post finalizado!
Este tópico foi arquivado e marcado como resolvido.
_ _
> ❒ - Equipe </Coffee Dimension>
- Obrigado por usar o sistema de ajuda!
                `);

            await interaction.reply({ embeds: [embed] });
            await interaction.channel.setLocked(true);
            await interaction.channel.setArchived(true);

        } catch (error) {
            console.error('Erro ao finalizar post:', error);
            await interaction.reply({
                content: client.formatEmoji('#e:errado Ocorreu um erro ao finalizar o post!'),
                 flags: ['Ephemeral'],
            });
        }
    }
};