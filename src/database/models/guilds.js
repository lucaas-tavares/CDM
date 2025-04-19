const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    lastShopUpdate: { type: Date, default: Date.now },
    availableColors: { type: Array, default: [] },
    lastShopMessageId: { type: String, default: null },
    lastBumpTime: { type: Date, default: null },
    lastBumpUser: { type: String, default: null }

});

module.exports = {
    Guildas: mongoose.model('Guildas', guildSchema)
};
