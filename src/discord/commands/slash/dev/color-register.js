const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require('discord.js');
const { Guilds } = require('../../../../database/models/guilds');

module.exports = {
  name: 'registrar-cor',
  description: 'Registre cores novas na loja',
  devOnly: true,
  category: 'dev',
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'cargos',
      description: 'Mencione os cargos ou cole os id separados por espaço',
      required: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: 'raridade',
      description: 'Tipo de raridade da cor',
      required: true,
      choices: [
        { name: 'Comum', value: 'c' },
        { name: 'Rara', value: 'b' },
        { name: 'Lendária', value: 'a' },
        { name: 'Especial', value: 's' },
      ],
    },
  ],
  run: async (client, interaction) => {
    const rawCargos = interaction.options.getString('cargos');
    const rarity = interaction.options.getString('raridade');
    const price =
      rarity === 'c'
        ? 500
        : rarity === 'b'
        ? 1500
        : rarity === 'a'
        ? 3000
        : 5000;

    const ids = [...new Set(rawCargos.match(/\d{17,20}/g))];
    const guildDb = await Guilds.findById(interaction.guild.id);
    const guildRoles = interaction.guild.roles.cache;

    const resultados = [];

    for (const id of ids) {
      const role = guildRoles.get(id);
      if (!role) {
        resultados.push(
         client.formatEmoji (`-# - #e:errado <@&${id}> não foi encontrado.`)
        );
        continue;
      }

      const rolePermissions = role.permissions.toArray();
      if (rolePermissions.length > 0) {
        resultados.push(
          client.formatEmoji(`-# #e:errado ${role} **Ignorado** - O cargo não pode conter permissões.`)
        );
        continue;
      }

      const registered = guildDb.colors.some((x) => x.id == role.id);
      if (registered) {
        resultados.push(
          client.formatEmoji(`-# #e:errado ${role} já está registrado.`)
        );
        continue;
      }

      guildDb.colors.push({ id: role.id, rarity, price });
      resultados.push(
        client.formatEmoji(`- #e:correto ${role} registrado com sucesso.`)
      );
    }

    await guildDb.save();

    return interaction.reply({
      content: client.formatEmoji(
        `#e:casa Informações:\n>>> ${resultados.join(
          '\n'
        )}`
      ),
    });
  },
};
