const Discord = require('discord.js');
const User = require('../../../../database/models/users');

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
        const member = interaction.guild.members.cache.get(targetUser.id);
        const userDB = await User.findOne({ _id: targetUser.id });

        if (!userDB) {
            return interaction.reply({ content: `Não tenho informações sobre este usuário...`, ephemeral: true });
        }
        
        const allUsers = await User.find().sort({ points: -1 });
        const rank = allUsers.findIndex(user => user._id == targetUser.id) + 1;

    interaction.reply({ content: client.formatEmoji(`## #estrela - Pontos de ${targetUser.displayName}\n- Atualmente você possui **(#pontos) ${userDB.points.toLocaleString()} pontos**!\n> Você está ocupando a posição **top \`#${rank}\`** no rank.\n-# Para mais informações, utilize \`/perfil\`!`) });
}
};
