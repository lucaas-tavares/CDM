const { ACHIEVEMENTS } = require('./achievements');
const Users = require('../../../database/models/users');
const { Guilds } = require('../../../database/models/guilds');
const { checkLevelUp } = require('../../../functions/utils/xpManager');

async function checkAchievements(userId, client, context, triggerType) {
  const userDb = await Users.findById(userId);
  if (!userDb) return;

  const guild = context.guild;
  const channel = context.channel;
  if (!guild || !channel) return;

  userDb.achievements = userDb.achievements || [];

  for (const id in ACHIEVEMENTS) {
    const achievement = ACHIEVEMENTS[id];

    if (achievement.triggers && !achievement.triggers.includes(triggerType)) {
      continue;
    }

    const alreadyUnlocked = userDb.achievements.some(a => a.id === id);
    if (alreadyUnlocked) continue;

    const unlocked = await achievement.condition(
      userDb,
      client,
      guild.id,
      Guilds
    );
    if (!unlocked) continue;

    userDb.achievements.push({
      id: id,
      unlockedAt: new Date()
    });

    if (achievement.rewards?.length) {
      for (const reward of achievement.rewards) {
        switch (reward.type) {
          case 'points':
            userDb.points += reward.value;
            break;
          case 'badge':
            userDb.badges = userDb.badges || [];
            userDb.badges.push(reward.value);
            break;
          case 'role':
            const role = guild.roles.cache.find(r => r.name === reward.value);
            if (role) {
              const member = await guild.members.fetch(userId).catch(() => null);
              if (member) await member.roles.add(role).catch(() => { });
            }
            break;
          case 'xp':
            userDb.xp += Number(reward.value);
            await checkLevelUp(userDb, client, channel);
            break;
        }
      }
    }

    await userDb.save();

    const message = await channel.send({
      content: client.formatEmoji(`-# <@${userId}> Nova conquista desbloqueada!
#e:estrela **${achievement.name}**
> ${achievement.description}
${achievement.rewards?.length > 0 ? `-# Recompensa: __${achievement.rewards.map(r => `${r.type === 'points' ? `#pontos ${r.value} pontos` : r.type === 'badge' ? `badge ${r.value}` : r.type === 'xp' ? `XP \`${r.value}\`` : ` Cargo ${r.value}`}`).join(' - ')}__` : ''}
-# Use \`/conquistas\` para ver suas conquistas.`)
    });

    setTimeout(() => message.delete().catch(() => { }), 15000);
  }
}

module.exports = checkAchievements;