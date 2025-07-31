const { generatePoints, bonus } = require('./pointsManager');

const config = {
  levels: {
    base: 1000,
    multiplier: 1.2,
  },
};

async function checkLevelUp(user, client, channel) {
  let leveledUp = false;
  let totalLevelsGained = 0;
  let totalPointsGained = 0;

  function getXpNeeded(level) {
    return Math.floor(config.levels.base * Math.pow(level, config.levels.multiplier));
  }

  while (user.xp >= getXpNeeded(user.level)) {
    const xpNeeded = getXpNeeded(user.level);
    user.xp -= xpNeeded;
    user.level++;
    totalLevelsGained++;
    leveledUp = true;

    const bonus = bonus(user.level);
    const pointsEarned = generatePoints() + bonus;
    user.points += pointsEarned;
    totalPointsGained += pointsEarned;

    console.log(`[LEVEL-UP] Novo nível: ${user.level} | XP necessário: ${xpNeeded} | Bônus: ${bonus} | Pontos ganhos: ${pointsEarned}`);
  }

  if (leveledUp && channel && client) {
    const message = await channel.send(
      client.formatEmoji(
        `#e:up <@${user._id}>, você subiu para o nível **${user.level}**!\n` +
        `-# Você ganhou (#pontos) **${totalPointsGained} pontos**${totalLevelsGained > 1 ? ` e subiu ${totalLevelsGained} níveis!` : ""}`
      )
    );

    setTimeout(() => {
      message.delete().catch(() => {});
    }, 15000);
  }

  return leveledUp;
}

module.exports = { checkLevelUp };
