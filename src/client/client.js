const { Client, Collection } = require('discord.js')
const colorize = require('strcolorize');
const { loadPrefixCommands, loadSlashCommands, setupEvents, loadComponents } = require('./handlers')
const { formatEmoji } = require('../functions/utils/FormatEmoji/index')
const { config } = require('./config');

module.exports = class lucy extends Client {
    constructor(options) {
        super({ intents: options.intents })

        this.developers = options.developers;
        this.guildsOnly = options.guildsOnly;
        this.prefix = options.prefix;
        this.token = options.token;
        this.config = config;

        this.commands = new Collection()
        this.prefixCommands = new Collection();
        this.components = new Collection();
        this.cooldowns = new Collection();

        this.formatEmoji = formatEmoji;
        this.logSummary = [];
    }

    async setup() {
        try {
            this.commands = loadSlashCommands(this, this.logSummary);
            this.prefixCommands = loadPrefixCommands(this, this.logSummary);
            setupEvents(this, this.logSummary);
            loadComponents(this, this.logSummary);
    
            await super.login(this.token);
            this.displaySummary();
            console.log(colorize(`#greenBright[success] Conectado em #bold magenta[${this.user.tag}]`));
        } catch(error) {
            console.error("Erro ao conectar o cliente:", error);
        }
    }

    displaySummary() {
        console.log(colorize("#bold black[---- ⚙ Aplicação ----]", false));//⚙
        this.logSummary.forEach((log) => console.log(colorize(`#greenBright[success] ${log}`)));
    }
}