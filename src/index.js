const lucy  = require('./client/client');
const { config } = require('./client/config');

const client = new lucy ({
    intents: 34759,
    prefix: 'c.',
    developers: ['1005290241743143043', '1065051526768373810'],
    guildsOnly: ['1327425233388568576','1093595922979631224', '1295786799477690481'],
    token: config.token,
});

client.setup();
require('./database')