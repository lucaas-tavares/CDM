const mongoose = require('mongoose');
const colorize = require('strcolorize');
const { User } = require('./models/users.js');
const { config } = require('../client/config');

mongoose.connect(config.database)
    .then(() => {
        console.log(colorize(`\n#black bold [\u22D5 Database ]\n #green[sucess] Conectado a database com sucesso!\n`));
    })
    .catch((error) => {
        console.error('Ocorreu um erro durante a conexão com o banco de dados:', error);
    });

module.exports = {
    User: User,
};