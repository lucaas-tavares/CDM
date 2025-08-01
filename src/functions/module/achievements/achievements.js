const ACHIEVEMENTS = {
    'first_color': {
        id: 'first_color',
        name: 'Primeira Cor!',
        category: 'color',
        description: 'Você comprou sua primeira cor!',
        condition: async (userDb) => userDb.colorsInventory?.length >= 1,
        rewards: [
            { type: 'points', value: 100 },
            { type: 'xp', value: '2000' }
        ],
        triggers: ['color_purchase']
    },
    'legendary_hunter': {
        id: 'legendary_hunter',
        name: 'Caçador de cores lendárias!',
        category: 'color',
        description: 'Comprou todas as cores lendárias disponíveis no servidor.',
        condition: async (userDb, client, guildId, Guilds) => {
            const guildDb = await Guilds.findById(guildId);
            if (!guildDb) return false;

            const legendaryColors = guildDb.colors.filter(
                color => color.rarity === 'a'
            ).map(color => color.id);

            if (legendaryColors.length === 0) return false;

            return legendaryColors.every(colorId =>
                userDb.colorsInventory?.includes(colorId)
            );
        },
        rewards: [
            { type: 'role', value: 'Colecionador Supremo' }
        ],
        triggers: ['color_purchase']
    },
    'first_bump': {
        id: 'first_bump',
        name: 'Ajudando a Dimensão!',
        category: 'bump',
        description: 'Utilizou /bump pela primeira vez',
        condition: async (userDb) => userDb.bumps >= 1,
        rewards: [
            { type: 'xp', value: '10000' },
            { type: 'points', value: 500 }
        ],
        triggers: ['bump_command']
    },
    'streak': {
        id: 'first_streak',
        name: '10x Consecutivos!',
        category: 'bump',
        description: 'Utilizou /bump 10 vezes seguidas',
        condition: async (userDb) => userDb.streak >= 10,
        rewards: [
            { type: 'xp', value: '5000' }
        ],
        triggers: ['bump_command']
    }
};

module.exports = { ACHIEVEMENTS };