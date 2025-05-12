const { ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { Guilds } = require('../../../../database/models/guilds')

module.exports = {
    name: 'registrar-cor',
    description: 'Registre novas cores na loja',
    devOnly: true,
    category: 'dev',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            type: ApplicationCommandOptionType.Role,
            name: 'cargo',
            description: 'Mencione um cargo de cor',
            required: true
        },
        {
            type: ApplicationCommandOptionType.String,
            name: 'raridade',
            description: 'Tipo de raridade da cor: comum, rara, lendária',
            required: true,
            choices: [
                { name: 'Comum', value: 'common' },
                { name: 'Rara', value: 'rare' },
                { name: 'Lendária', value: 'legendary' },
            ]
        }
    ],
    run: async (client, interaction) => {
        const role = interaction.options.getRole('cargo');
        const rarity = interaction.options.getString('raridade');
        const price = rarity === 'common'? 500 : rarity === 'rare'? 1500 : 3000;
        const guildDb = await Guilds.findById(interaction.guild.id);
        const rolePermissions = role.permissions.toArray();
        
        if (rolePermissions.length > 0) {
            return interaction.reply({
                content: client.formatEmoji(`
                    #e:errado **Cargo inválido!**\n- O cargo ${role} **não pode ter permissões** (ex: \`Ver Canais, Administrador\`).\n-# - Remova todas as permissões do cargo e tente novamente.
                `)
            });
        }

        if (guildDb.colors.some(x => x.id == role.id)) {
            return interaction.reply({ content: client.formatEmoji(`#e:errado A cor ${role} já está __registrada__!`) });
        }

        try {
            guildDb.colors.push({
                id: role.id,
                rarity: rarity,
                price: price,
            });
            await guildDb.save()

            return interaction.reply({ content: client.formatEmoji(`#e:correto Pronto, a cor foi registrada com sucesso\n-# **Informações:**\n> - → Cargo: ${role}\n> - → Raridade: **${rarity == 'common' ? "Comum" : rarity == 'rare' ? 'Rara' : 'Lendária'}.**\n> - → Valor: **${price.toLocaleString()}**.`) })
        } catch (err) {
            console.log(`[R-Color] Erro ao registrar uma cor - ${role.id}:`, err)
            return interaction.reply(client.formatEmoji('#e:errado Ops, deu um erro aqui!'))
        }

    }
}