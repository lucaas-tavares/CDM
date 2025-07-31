const User = require('../../database/models/users');
const { checkLevelUp } = require('../../functions/utils/xpManager');

const config = {
  xp: {
    cooldown: 30000,
    maxXP: 60,
    minLength: 5,
    minNewLength: 12,
    divisorMin: 7,
    divisorMax: 4,
  },
};

function newText(text) {
  return text.replace(/(.)\1+/g, '$1');
}

async function XP(client, message, userDB) {
  try {
    if (message.author.bot || message.channel.type === 'dm') return;

    const content = message.content.trim();

    if (content.length < config.xp.minLength || content === userDB.lastMessage)
      return;

    const now = Date.now();
    const lastMessageTime = userDB.lastMessageTime || 0;
    const textLength = newText(content).length;

    if (textLength < config.xp.minNewLength) return;

    if (now - lastMessageTime < config.xp.cooldown) return;

    const minXP = Math.floor(textLength / 2.5);
    const maxXP = Math.floor(textLength / 1.2);
    let baseXP = Math.min(
      config.xp.maxXP,
      Math.floor(Math.random() * (maxXP - minXP) + minXP)
    );
    
    if (baseXP > config.xp.maxXP) {
      baseXP = config.xp.maxXP;
    }

    const multiplier = userDB.xpMultiplier || 1.2;
    const finalXP = Math.floor(baseXP * multiplier);

    userDB.xp += finalXP;
    userDB.lastMessage = content;
    userDB.lastMessageTime = now;

    await checkLevelUp(userDB, client, message.channel);
    await userDB.save();

    console.log(`[XP] ${message.author.username} ganhou ${finalXP} XP.`);
  } catch (err) {
    console.error(`[XP ERRO] ${err.message}`);
  }
}

module.exports = XP;
