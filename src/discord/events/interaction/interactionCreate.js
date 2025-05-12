const User = require('../../../database/models/users');

module.exports = {
    type: 'interactionCreate',
    run: async (client, interaction, args) => {
        if (interaction.isChatInputCommand()) {
            const cmd = client.commands.get(interaction.commandName);
            if (!cmd) {
                return interaction.reply({
                    content: 'Error: comando não encontrado!',
                    ephemeral: true
                });
            }
            return cmd.run(client, interaction);
        }
        if (interaction.message && interaction.message.createdTimestamp < (client.readyTimestamp || 0)) {
            return interaction.reply({
                content: 'Os dados dessa interação foram perdidos.',
                ephemeral: true
            });
        }

        if (interaction.isMessageComponent()) {
            const userdb = await User.findById({ _id: interaction.user.id });

            const args = interaction.customId.split(':');
            const interactionId = args.shift();
            const componentData = client.components.get(interactionId);

            if (!componentData) return;

            if (componentData.authorOnly && interaction.user.id !== args[0]) {
                return interaction.reply({
                    content: 'Amigão, isso não é para você',
                    ephemeral: true
                });
            }

            return componentData.run({ client, interaction, userdb, args });
        }

        if (interaction.isModalSubmit()) {
            const userdb = await User.findById({ _id: interaction.user.id });

            const args = interaction.customId.split(':');
            const interactionId = args.shift();
            const componentData = client.components.get(interactionId);

            if (!componentData) return;

            return componentData.run({ client, interaction, userdb, args });
        }

    }
};