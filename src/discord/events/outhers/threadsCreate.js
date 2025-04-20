module.exports = {
    type: 'messageCreate',
    run: async (client, message) => {
        const channelId = "1331868240648867941";

        if (message.channel.id === channelId){
            try {
                const thread = await message.startThread(
                    {
                        name: 'Envie as avaliações aqui!!',
                        autoArchiveDuration: 1440,
                        reason: ':D',


                    }
                );
            } catch (error){
                console.error('Ouve um erro durante a criação do threads:', error)
            }
        }
    }
}