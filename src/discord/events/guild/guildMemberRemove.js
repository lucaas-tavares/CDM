const Users = require("../../../database/models/users");

module.exports = {
  type: "guildMemberRemove",
  run: async (client, member) => {
    try {
      const userDB = await Users.findOne({ _id: member.id });
      if (!userDB) return;

      await Users.deleteOne({ _id: member.id });

      const channelId = client.config.logChannel;
      const channel = member.guild.channels.cache.get(channelId);

      if (channel && channel.isTextBased()) {
        channel.send({
          content: client.formatEmoji(`#e:megaFone Todos os dados de **${member.user.username}** - \`${member.user.id}\` foram deletados da database.`),
        });
      }
    } catch (err) {
      const errorChannel = member.guild.channels.cache.get(channelId); 
      if (errorChannel && errorChannel.isTextBased()) {
        errorChannel.send(
          client.formatEmoji(`#e:errado Erro ao tentar deletar ${member.user.username} da database.`)
        );
      }
    }
  },
};
