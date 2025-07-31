const { Client, Collection } = require("discord.js");
const { logger, icon } = require("@kauzx/logger");
const {
  loadPrefixCommands,
  loadSlashCommands,
  setupEvents,
  loadComponents,
} = require("./handlers");
const { formatEmoji } = require("../functions/utils/FormatEmoji/index");
const { config } = require("./config");
require('../functions/module/antiCrash')

module.exports = class lucy extends Client {
  constructor(options) {
    super({ intents: options.intents });

    this.developers = options.developers;
    this.guildsOnly = options.guildsOnly;
    this.prefix = options.prefix;
    this.token = options.token;
    this.config = config;

    this.commands = new Collection();
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
      logger.style(
        `{bold.cyan success} - connected in {bold.magenta ${this.user.tag}}`
      );
    } catch (error) {
     logger.error("Erro ao conectar o cliente:", error);
    }
  }

  displaySummary() {
    logger.style(`{bold.black ---- ${icon.debug} Application ----}`, false); //⚙
    this.logSummary.forEach((log) =>
      logger.style(`{cyan success} ${log}`)
    );
  }
};
