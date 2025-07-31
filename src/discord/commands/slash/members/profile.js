const {
  ApplicationCommandType,
  AttachmentBuilder,
  ApplicationCommandOptionType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const Users = require("../../../../database/models/users");
const { logger } = require("@kauzx/logger");
const generateProfile = require("../../../../functions/module/generateProfile");

module.exports = {
  name: "perfil",
  description: "descrição",
  devOnly: false,
  category: "categoria",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "usuário",
      description: "Mencione um usuário para visualizar o perfil dele",
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],
  run: async (client, interaction) => {
    await interaction.deferReply();

    const inputUser =
      interaction.options.getUser("usuário") || interaction.user;
    const user = await client.users.fetch(inputUser.id, { force: true });
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.editReply({
        content: client.formatEmoji(
          "#e:errado Este usuário não está no servidor."
        ),
        flags: ["Ephemeral"]
      });
    }

    if (!user)
      return interaction.reply(
        client.formatEmoji("#e:errado Não possuo informações deste usuário.")
      );
    const userDB = await Users.findOneAndUpdate(
      { _id: user.id },
      {},
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const profile = await generateProfile(client, user, userDB, Users);

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`aboutMe:${interaction.user.id}`)
        .setLabel("Editar Sobre mim")
        .setEmoji(client.formatEmoji("#pincel"))
        .setStyle(ButtonStyle.Secondary)
    );
    try {
      const image = new AttachmentBuilder(profile, {
        name: "user-profile.png",
      });

      const isAuthor = user.id === interaction.user.id;

      interaction.editReply({
        files: [image],
        components: isAuthor ? [button] : [],
      });

      const msg = await interaction.fetchReply();

      client.profileCache = client.profileCache || new Map();
      client.profileCache.set(interaction.user.id, msg);
    } catch (error) {
      logger.error(error);
    }
  },
};
