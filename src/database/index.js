const mongoose = require('mongoose');
const colorize = require('strcolorize');
const { User } = require('./models/users.js');
const { config } = require('../client/config');
const { logger } = require('@kauzx/logger');

mongoose.connect(config.database)
    .then(() => {
        logger.style(`{bold.black \u22D5 Database}\n {bold.green sucess} Successfully connected to database!\n`);
    })
    .catch((error) => {
        logger.error('Ocorreu um erro durante a conexão com o banco de dados:', error);
    });

module.exports = {
    User: User,
};