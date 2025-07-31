const colorize = require('strcolorize');
const User = require('../../../database/models/users');
const { Guilds } = require('../../../database/models/guilds');
const XP = require('../../../functions/module/xp');

module.exports = {
  type: 'messageCreate',
  run: async (client, message) => {
    if (message.author.bot || !message.guild) return;
    if (!client.guildsOnly.includes(message.guild.id)) return;

    if (message.content.replace('!', '').startsWith(`<@${client.user.id}>`)) {
      return message.reply(
        client.formatEmoji(
          `#planta ・Oi, ${message.author}, sabia que meus comandos são em slash? Não? Não sabia? Pois agora está sabendo.\n> → utilize \`/\` para ver os meus comandos.\n> Algumas sugestões → \`/perfil\` - \`/loja\` - \`/level\``
        )
      );
    }

    let userdb = await User.findById(message.author.id);
    if (!userdb) {
      userdb = await new User({
        _id: message.author.id,
        xp: 0,
        level: 1,
        points: 0,
        lastMessage: message.content,
        lastMessageTime: Date.now(),
      })
        .save()
        .catch((err) =>
          console.log(
            colorize(
              `#redBg [User] - Não foi possível criar o usuário no banco de dados`
            ),
            err
          )
        );
    }

    let guildDb = await Guilds.findById(message.guild.id);
    if (!guildDb) {
      guildDb = await new Guilds({
        _id: message.guild.id,
      })
        .save()
        .catch((err) =>
          console.log(
            colorize(
              `#redBg [User] - Não foi possível criar a guilda no banco de dados`
            ),
            err
          )
        );
    }

    await XP(client, message, userdb);
    if (!message.content.startsWith(client.prefix)) return;

    const args = message.content
      .slice(client.prefix.length)
      .trim()
      .split(/ +/g);
    const cmdName = args.shift().toLowerCase();
    const command =
      client.prefixCommands.get(cmdName) ||
      client.prefixCommands.find((als) => als.aliases?.includes(cmdName));

    if (!command) {
      return message.reply(
        client.formatEmoji(
          `#e:errado Não foi possível localizar esse comando. Utilize \`${client.prefix}help\`.`
        )
      );
    }

    if (command.devOnly && !client.developers.includes(message.author.id)) {
      return message.reply(client.formatEmoji(`#e:errado se saia`));
    }

    const cooldownKey = `${message.author.id}-${command.name}`;

    if (!client.developers.includes(message.author.id)) {
      if (client.cooldowns.has(cooldownKey)) {
        const remaining = Math.trunc(client.cooldowns.get(cooldownKey) / 1000);
        return message.channel.send(
          client.formatEmoji(
            `#e:relogio Você poderá utilizar comandos novamente em: <t:${remaining}:R>s`
          )
        );
      }

      client.cooldowns.set(cooldownKey, Date.now() + 7000);
      setTimeout(() => {
        client.cooldowns.delete(cooldownKey);
      }, 7000);
    }

    try {
      command.run(client, message, args, userdb, guildDb);
    } catch (error) {
      console.log(
        colorize(
          `#redBg [Command] - Houve um erro ao tentar executar o comando`
        ),
        error
      );
    }
  },
};
