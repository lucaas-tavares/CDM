const Discord = require('discord.js');
const Users = require('../../../../database/models/users');

module.exports = {
    name: 'pontos',
    description: 'Visualize os pontos de um usuário e algumas informações úteis',
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'usuário',
            description: 'O usuário que você quer visualizar os pontos',
            type: Discord.ApplicationCommandOptionType.User,
            required: false
        }
    ],
    run: async (client, interaction) => {
        const targetUser = interaction.options.getUser('usuário') || interaction.user;
        const userDB = await Users.findOne({ _id: targetUser.id });

        if (!userDB) {
            return interaction.reply({ content: `Não tenho informações sobre este usuário...`,  flags: ['Ephemeral'], });
        }

        const allUsers = await Users.find().sort({ points: -1 });
        const rank = allUsers.findIndex(user => user._id == targetUser.id) + 1;

    interaction.reply({ content: client.formatEmoji(`## #estrela - Pontos de ${targetUser.displayName}\n- Atualmente ${targetUser == interaction.user.id ? 'você' : 'ele' } possui **(#pontos) ${userDB.points.toLocaleString()} pontos**!\n> ${targetUser == interaction.user.id ? 'você' : 'ele' } está ocupando a posição **top \`#${rank}\`** no rank.\n-# Para mais informações, utilize \`/perfil\`!`) });
}
};
