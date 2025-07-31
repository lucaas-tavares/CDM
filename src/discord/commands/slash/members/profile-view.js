/* const {
  ApplicationCommandType,
  EmbedBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ActionRowBuilder,
  ContainerBuilder,
  ComponentType,
  SeparatorSpacingSize,
} = require("discord.js");
const Users = require("../../../../database/models/users");
const { XPBar } = require("../../../../functions/utils/xpBar");

module.exports = {
  name: "perfil",
  description: "visualize seu perfil",
  devOnly: false,
  category: "members",
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
    const user = interaction.options.getUser("usuário") || interaction.user;
    const userDB = await Users.findOne({ _id: user.id });

    const portfolioLink =
      userDB.portfolio == null
        ? ""
        : `> - **[Meu Portfólio](${userDB.portfolio})**`;
    const role = interaction.guild.roles.cache.get(userDB.equippedColor);
    const xpMultiplier = 1.2;
    const baseXp = 1000;
    const nextLevelXp = Math.floor(baseXp * userDB.level ** xpMultiplier);
    const xpBar = XPBar(userDB.xp, nextLevelXp);
    const allUsers = await Users.find().sort({ points: -1 });
    const rank = allUsers.findIndex((x) => x._id == user.id) + 1;

    const content = new ContainerBuilder({
      accent_color: role?.color && role.color !== 0 ? role.color : 0x2f3136,
    });

    if (userDB.banner) {
      content.addMediaGalleryComponents({
        items: [
          {
            media: {
              url: "https://media.discordapp.net/attachments/1327425235716276322/1388012265307111445/31_Sem_Titulo_20250627001825.png",
            },
          },
        ],
      });
    }

    content.addSectionComponents({
      components: [
        {
          type: ComponentType.TextDisplay,
          content: client.formatEmoji(`         
## #membros ・Perfil de ${user.displayName}
> - __Username:__ ${user.username}
> - __ID:__ \`${user.id}\`
> **— Sobre mim**
> -# **${
            userDB.aboutme ||
            "Olá, mundo!! Sejam todos bem vindos ao meu perfil!\n> -# - Você pode editar seu **sobre-mim** utilizando o botão abaixo."
          }**
${portfolioLink}
`),
        },
      ],
      accessory: {
        type: ComponentType.Thumbnail,
        media: {
          url: user.displayAvatarURL({
            dynamic: true,
            format: "png",
            size: 1024,
          }),
        },
      },
    });

    content.addSeparatorComponents({
      type: ComponentType.Separator,
      divider: true,
      spacing: SeparatorSpacingSize.Small,
    });

    content.addTextDisplayComponents({
      content: client.formatEmoji(
        `
### #lupa・Estatísticas
> ・#planta → **Level ${userDB.level}**
> ・#lista → XP: __\`${userDB.xp.toLocaleString()}/${nextLevelXp.toLocaleString()}\`__
> -# - Progresso: **\`${xpBar}\`**
> ・#estrela → **${userDB.points.toLocaleString()} Pontos!**
> -# - Posição no Rank: **\`#${rank}\`**
> ・#relogio → **${userDB.bumps} Bumps!**
`
      ),
    });

    content.addSeparatorComponents({
      type: ComponentType.Separator,
      divider: true,
      spacing: SeparatorSpacingSize.Small,
    });

    content.addTextDisplayComponents({
      content: client.formatEmoji(
        `
> ・#pincel → Cor: ${
          userDB.equippedColor === null
            ? "__`Nenhuma`__"
            : `<@&${userDB.equippedColor}>`
        }
> ・#membros → Família: __\`Nenhuma\`__
> ・#presente → Vip: __\`Não\`__
> ・#booster → Booster: __\`Não\`__`
      ),
    });
    if (interaction.user.id === user.id) {
      content.addSeparatorComponents({
        type: ComponentType.Separator,
        divider: true,
        spacing: SeparatorSpacingSize.Small,
      });

      content.addActionRowComponents({
        components: [
          new ButtonBuilder({
            label: "Editar Perfil",
            emoji: client.formatEmoji("#pincel"),
            customId: `editProfile:${interaction.user.id}`,
            style: 2,
          }),
        ],
      });
    }

    await interaction.reply({
      embeds: [embedProfile],
      components: isAuthor ? [row] : [],
      components: [content],
      flags: ["IsComponentsV2"],
    });

    const msg = await interaction.fetchReply();

    client.profileCache = client.profileCache || new Map();
    client.profileCache.set(user.id, msg);
  },
};
 */