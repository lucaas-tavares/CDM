const { AttachmentBuilder } = require("discord.js");
const Users = require("../../../../database/models/users");
const { logger } = require("@kauzx/logger");
const generateProfile = require("../../../../functions/module/generateProfile");

module.exports = {
  id: "editField",
  authorOnly: true,
  run: async ({ client, interaction, userdb, args }) => {
    const value = interaction.fields.getTextInputValue("fieldInput")?.trim();

    userdb.aboutme = value || null;
    await userdb.save();

    const msg = client.profileCache?.get(interaction.user.id);
    if (!msg) {
      return interaction.reply({
        content: "Vish, deu erro",
        flags: ["Ephemeral"],
      });
    }
    const user = await client.users.fetch(interaction.user.id, { force: true });
    const userDB = await Users.findOne({ _id: user.id });

    const profile = await generateProfile(client, user, userDB, Users);
    try {
      const image = new AttachmentBuilder(profile, {
        name: "user-profile.png",
      });

      await msg.edit({ files: [image], components: [] });
    } catch (error) {
      logger.error(error);
      return interaction.reply({
        content: "Erro ao atualizar o perfil.",
        ephemeral: true,
      });
    }
  },
};
