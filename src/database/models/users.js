const { Schema, model } = require('mongoose');

const usersModel = new Schema({
    _id: { type: String, required: true },
    points: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    lastMessage: { type: String, default: '' },
    lastMessageTime: { type: Date, default: Date.now },
    // bump
    bumps: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    // conquistas
    achievements: { type: [String], default: null }
});

module.exports = model('Membros', usersModel);
