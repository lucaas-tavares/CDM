const Users = require('../../../database/models/users.js');
const { Guilds } = require('../../../database/models/guilds.js');
const { generatePoints } = require('../../../functions/utils/pointsManager.js');
const checkAchievements = require('../../../functions/module/achievements/checkAchievements.js');

module.exports = {
  type: 'messageCreate',
  run: async (client, message) => {
    if (!message.guild || !message.channel) return;
    if (message.author.id !== '302050872383242240') return;

    if (message.embeds.length > 0) {
      const embed = message.embeds[0];

      if (embed.description && embed.description.includes('Bump done!')) {
        let userId = null;

        if (message.interaction?.user?.id) {
          userId = message.interaction.user.id;
        }

        if (!userId) {
          return;
        }

        let userData =
          (await Users.findOne({ _id: userId })) ||
          new Users({ _id: userId, points: 0, bumps: 0, streak: 0 });
        let guildData =
          (await Guilds.findOne({ _id: message.guild.id })) ||
          new Guilds({
            _id: message.guild.id,
            lastBumpUser: null,
            lastBumpTime: null,
          });

        if (guildData.lastBumpUser === userId) {
          userData.streak += 1;
        } else {
          userData.streak = 1;
        }
        
        const pointsToAdd = 100 + userData.streak * 3;
        userData.points += pointsToAdd;
        userData.bumps += 1;

        guildData.lastBumpUser = userId;
        guildData.lastBumpTime = new Date();

        await userData.save();
        await guildData.save();
        await checkAchievements(userId, client, message, 'bump_command');

        message.channel.send(
          client.formatEmoji(
            `## #gatoBlush・Obrigado pelo bump!\n<@${userId}>, Você deu \`/bump\` no servidor e recebeu **(#estrela) ${pointsToAdd.toLocaleString()} Pontos **\n> - → Total de bumps: __**${
              userData.bumps
            }**__\n> - Streak: __${
              userData.streak
            }x__\n-# → Não esqueça de usar \`/bump\` novamente **__daqui 2 horas__**, caso contrário, irá perder seu streak.`
          )
        );

        setTimeout(async () => {
          const updatedGuildData = await Guilds.findOne({
            _id: message.guild.id,
          });

          if (
            updatedGuildData.lastBumpTime.getTime() ===
            guildData.lastBumpTime.getTime()
          ) {
            message.channel.send(
              client.formatEmoji(
                `## #gatoAhh・Bump Disponível\n> - → **Alguém ai?** O bump já __está disponível__ novamente!\n> - Digite \`/bump\` e **receba pontos**!\n-# #megaFone - Ping: <@&1327425233388568581> <@&1327425233388568578>`
              )
            );
          }
        }, 2 * 60 * 60 * 1000);
      }
    }
  },
};
