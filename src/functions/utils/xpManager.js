const { generatePoints, milestoneBonus } = require('./pointsManager')

const config = {
    levels: {
      base: 1000,
      multiplier: 1.2,
    }
  };
  
  async function checkLevelUp(user, client, channel) {
    let leveledUp = false;
  
    while (user.xp >= Math.floor(config.levels.base * Math.pow(config.levels.multiplier, user.level - 1))) {
      const xpNeeded = Math.floor(config.levels.base * Math.pow(config.levels.multiplier, user.level - 1));
      user.xp -= xpNeeded;
      user.level++;
      leveledUp = true;
  
      const bonus = milestoneBonus(user.level);
      const pointsEarned = generatePoints() + bonus;
      user.points += pointsEarned;
  
      if (channel && client) {
        const message = await channel.send(client.formatEmoji(
          `#e:up <@${user._id}>, você subiu para o nível **${user.level}**!\n` +
          `-# Você ganhou (#pontos) **${pointsEarned} pontos**!`
        ));
        
        setTimeout(() => {
            message.delete().catch(() => {});
          }, 15000);
      }
    }
  
    return leveledUp;
  }
  
  module.exports = { checkLevelUp };
  