const Discord = require('discord.js');
const User = require('../../../../database/models/users');

module.exports = {
    name: 'pontos-alterar',
    description: 'Dev: Adicione ou remova pontos dos viajantes.',
    devOnly: true,
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            type: Discord.ApplicationCommandOptionType.String,
            name: 'viajantes',
            description: 'IDs ou menções dos viajantes que você deseja alterar os pontos, separados por vírgulas.',
            required: true
        },
        {
            type: Discord.ApplicationCommandOptionType.Integer,
            name: 'pontos',
            description: 'Informe a quantia de pontos que será alterada.',
            required: true
        },
        {
            type: Discord.ApplicationCommandOptionType.Boolean,
            name: 'remover',
            description: 'Se verdadeiro, os pontos serão removidos em vez de adicionados.',
            required: false
        }
    ],

    run: async (client, interaction) => {
        const viajantesString = interaction.options.getString('viajantes');
        const pontos = interaction.options.getInteger('pontos');
        const remover = interaction.options.getBoolean('remover') || false;

        if (!viajantesString || !pontos) {
            return interaction.reply(client.formatEmoji('#e:errado Mencione ao menos um usuário e especifique os pontos.'));
        }

        const viajantesIDs = viajantesString.match(/<@?(\d+)>/g).map(mention => mention.match(/\d+/)[0]);

        const promises = viajantesIDs.map(async (id) => {
            try {
                let userDB = await User.findById(id);

                if (!userDB) {
                    return `#e:errado Não foi possível encontrar o <@${id}> em meu banco de dados.`;
                }

                if (remover) {
                    userDB.points -= pontos;
                    if (userDB.points < 0) userDB.points = 0;
                    await userDB.save();
                    return `#e:correto **${pontos}** pontos foram removidos de: <@${id}>.`;
                } else {
                    userDB.points += pontos;
                    await userDB.save();
                    return `#e:correto **${pontos}** pontos foram adicionados para: <@${id}>.`;
                }
            } catch (error) {
                console.error(`Houve um erro ao alterar os pontos para: ${id}:`, error);
                return `#e:errado Não foi possível alterar os pontos para o usuário: <@${id}>.`;
            }
        });

        const results = await Promise.all(promises);
        interaction.reply(client.formatEmoji(results.join('\n')));
    }
};
