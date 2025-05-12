const User = require('../../database/models/users');
const { checkLevelUp } = require('../../functions/utils/xpManager');

const config = {
    xp: {
        min: 50,
        max: 150,
        cooldown: 60000,
        minLength: 10
    },
    levels: {
        base: 1000,
        multiplier: 1.2,
    }
};

async function XP(client, message, userdb) {
    try {
        if (message.author.bot || message.channel.type === 'dm')

            if (message.content.length < config.xp.minLength ||
                message.content === userdb.lastMessage) {
                return;
            }

        const now = Date.now();
        const lastMessageTime = userdb.lastMessageTime || 0;

        if (now - lastMessageTime < config.xp.cooldown) {
            return;
        }

        const xpGained = Math.floor(
            config.xp.min + Math.random() * (config.xp.max - config.xp.min)
        );

        userdb.xp += xpGained;
        userdb.lastMessage = message.content;
        userdb.lastMessageTime = now;

        checkLevelUp(userdb, client, message.channel);        
        await userdb.save();

    } catch (err) {
        console.error(`Erro no sistema de XP: ${err.message}`);
    }
}

module.exports = XP;