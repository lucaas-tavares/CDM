const User = require('../../database/models/users');

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
        minPoints: 150,
        maxPoints: 450
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

        const xpNeeded = Math.floor(config.levels.base * Math.pow(config.levels.multiplier, userdb.level - 1));

        if (userdb.xp >= xpNeeded) {
            userdb.level += 1;
            userdb.xp = 0;
            
            const pointsEarned = Math.floor(
                Math.random() * (config.levels.maxPoints - config.levels.minPoints + 1) + 
                config.levels.minPoints
            );
            userdb.points += pointsEarned;

            message.channel.send(client.formatEmoji(
                `#e:up ${message.author}, você subiu para o nível **${userdb.level}**!\n` +
                `-# Você ganhou (#pontos) **${pointsEarned} pontos**!`
            ));
        }

        await userdb.save();

    } catch (err) {
        console.error(`Erro no sistema de XP: ${err.message}`);
    }
}

module.exports = XP;