const { Guildas } = require('../../../../database/models/guilds');
const colorData = require('../../../../data/outhers/SHOP_ROLES_ID.json');

module.exports = {
    id: 'colorPurchase',
    run: async ({ client, interaction, userdb }) => {
        const position = interaction.fields.getTextInputValue('color-position');
        const index = parseInt(position) - 1;
        const allColors = colorData.colors;

        const chosenColor = allColors[index];

        if (!chosenColor) {
            return interaction.reply({
                content: client.formatEmoji('#e:errado Posição inválida!\n-# Tente novamente!'),
                ephemeral: true
            });
        }

        if (userdb.points < chosenColor.price) {
            return interaction.reply({
                content: client.formatEmoji(`#e:errado Você não tem pontos suficientes para comprar esta cor.\n-# Você precisa de mais \`[ ${chosenColor.price - userdb.points} pontos ]\``),
                ephemeral: true
            });
        }

        userdb.points -= chosenColor.price;
        await userdb.save();

        const role = interaction.guild.roles.cache.get(chosenColor.id);
        if (!role) {
            return interaction.reply({
                content: client.formatEmoji(`#e:errado O cargo da cor selecionada não foi encontrado!`),
                ephemeral: true
            });
        }

        const userColorRoles = interaction.member.roles.cache.filter(role =>
            allColors.some(color => color.id === role.id)
        );

        let removedRolesMessage = '';
        if (userColorRoles.size > 0) {
            await interaction.member.roles.remove(userColorRoles.map(role => role.id));
            removedRolesMessage = `\n-# A cor antiga ${userColorRoles.map(role => `<@&${role.id}>`).join(', ')} foi desativada.\n-# **As cores que você comprou estão armazenadas em seu inventário, para visualizar, utilize \`/inventário\`**`;
        }

        await interaction.member.roles.add(role);

        return interaction.reply({
            content: client.formatEmoji(`#e:correto Você **comprou com sucesso** a cor <@&${chosenColor.id}>!!${removedRolesMessage}`),
            ephemeral: true
        });
    }
};