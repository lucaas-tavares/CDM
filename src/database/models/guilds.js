const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
    _id: { type: String, required: true },

    lastShopUpdate: { type: Date, default: Date.now },
    availableColors: { type: Array, default: [] },
    lastShopMessageId: { type: String, default: null },
    colors: {
        type: [
            {
                id: { type: String, default: null },
                rarity: { type: String, default: null },
                price: { type: Number, default: null },
            }
        ], default: []
    },
    lastBumpTime: { type: Date, default: null },
    lastBumpUser: { type: String, default: null }

});

module.exports = {
    Guilds: mongoose.model('Guilds', guildSchema)
};
