const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { addPoints } = require('../../../../functions/utils/pointsManager');

module.exports = {
    name: 'recompensar_ajuda',
    description: 'Recompensa os usuários que te ajudaram',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'destaque',
            description: 'Usuário que mais contribuiu (resposta completa)',
            type: 6,
            required: true
        },
        {
            name: 'ajudantes',
            description: 'Outros que ajudaram (@user1 @user2)',
            type: 3,
            required: false
        },
        {
            name: 'avaliar',
            description: 'Avaliações individuais (@user1 🔥 @user2 ⭐)',
            type: 3,
            required: false
        }
    ],
    run: async (client, interaction) => {

        if (!interaction.channel.isThread() || interaction.channel.ownerId !== interaction.user.id) {
            return interaction.reply({
                content: client.formatEmoji('#e:errado Comando restrito ao autor do post!'),
                ephemeral: true
            });
        }

        const destacado = interaction.options.getUser('destaque');
        const ajudantesMencionados = interaction.options.getString('ajudantes') || '';
        const avaliacoesTexto = interaction.options.getString('avaliar') || '';

        const getPontos = (emoji) => {
            const ranges = { '🔥': [5, 7], '⭐': [3, 5], '🌚': [1, 3] };
            const [min, max] = ranges[emoji] || [3, 5];
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        const avaliacoes = {};
        const regexAvaliacoes = /<@!?(\d+)>\s*([🔥⭐🌚])/g;
        let match;
        while ((match = regexAvaliacoes.exec(avaliacoesTexto)) !== null) {
            avaliacoes[match[1]] = match[2];
        }

        try {
            const recompensas = [];

            const avaliacaoDestaque = avaliacoes[destacado.id] || '🔥';
            const pontosDestaque = getPontos(avaliacaoDestaque);
            await addPoints(destacado.id, pontosDestaque, `Destaque no post ${interaction.channel.id}`);
            recompensas.push({ user: destacado, tipo: 'Destaque', emoji: avaliacaoDestaque, pontos: pontosDestaque });

            const ajudantesIds = ajudantesMencionados.match(/<@!?(\d+)>/g) || [];
            for (const mention of ajudantesIds) {
                const userId = mention.match(/<@!?(\d+)>/)[1];
                const emoji = avaliacoes[userId] || '⭐';
                const pontos = getPontos(emoji);

                await addPoints(userId, pontos, `Ajudante no post ${interaction.channel.id}`);
                recompensas.push({ user: { id: userId }, tipo: 'Ajudante', emoji, pontos });
            }

            const embed = new EmbedBuilder()
                .setColor(0x6F4E37)
                .setDescription(`
## ⭐・Pedido finalizado!
**${recompensas.length}** Usuários foram avaliados por prestarem ajuda!
-# **Informações:**
- → Destaque/s: <@${destacado.id}> → **${pontosDestaque} pontos** (${avaliacaoDestaque})
- → Ajudantes: ${ajudantesIds.length > 0
                        ? ajudantesIds.map((m, i) => {
                            const r = recompensas[i + 1];
                            return `<@${m.match(/<@!?(\d+)>/)[1]}> → **${r.pontos} pts** (${r.emoji})`;
                        }).join('\n')
                        : 'Nenhum ajudante adicional'}

_ _ 
> ❒ — Equipe </Coffee Dimension>
-# - O comando pode apresentar falhas, caso encontre uma falha, entre em contato com a equipe staff.
-# **Atenção**: Essa postagem será fechada em \`5 minutos!\`
                    `);
            await interaction.reply({ embeds: [embed] });

            setTimeout(async () => {
                try {
                    await interaction.channel.setLocked(true);
                    await interaction.channel.setArchived(true);
                } catch (error) {
                    console.error('Erro ao arquivar post:', error);
                }
            }, 300000);

        } catch (error) {
            console.error('Erro ao recompensar:', error);
            await interaction.reply({
                content: client.formatEmoji('#e:errado Ocorreu um erro ao processar as recompensas!'),
                ephemeral: true
            });
        }
    }
};