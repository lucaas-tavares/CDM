module.exports = {
    id: 'test',
    expire: 30000 + Date.now(),
    run: async (client, interaction) => {
        interaction.reply({ content: `🏓** | Pong!** \`${client.ws.ping} ms\``});
    }
}