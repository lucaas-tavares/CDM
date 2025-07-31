const { inspect } = require('util');

module.exports = {
    name:'eval',
    aliases:['e'],
    description:'「Util」eval',
    devOnly: true,
    run: async (client, message, args, userdb, guildDb) => {
      try {
        const code = args.join(' ');

        const evaled = await (async () => {
            return await eval(code);
        })();

        const formattedResult = inspect(evaled, { depth: 1 }).substring(0, 1990);

        message.channel.send(`\`\`\`js\n${formattedResult}\`\`\``);
    } catch (error) {
        message.channel.send(`\`\`\`js\n${error}\`\`\``);
    }
  }
};