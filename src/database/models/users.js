const { Schema, model } = require('mongoose');

const usersModel = new Schema({
    _id: { type: String, required: true },
    points: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    lastMessage: { type: String, default: '' },
    lastMessageTime: { type: Date, default: null },
    bumps: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    achievements: {
        type: [
            {
                id: { type: String, required: true },
                name: { type: String, required: true },
                category: { type: String, required: true },
                description: { type: String, required: true },
                unlockedAt: { type: Date, default: Date.now }
            }
        ],
        default: []
    },      
    colorsInventory: { type: [String], default: [] },
    equippedColor: { type: String, default: null },
    aboutme: { type: String, default: 'Olá, mundo!!!'},
    portfolio: { type: String, default: null },
    banner: { type: String, default: null },

});

module.exports = model('Membros', usersModel);
