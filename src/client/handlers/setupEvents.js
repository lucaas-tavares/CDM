const fs = require('fs');
const path = require('path');

function setupEvents(client, logSummary) {
    const eventCount = { success: 0, failed: 0 };

    const eventsPath = path.resolve(__dirname, '../../discord/events');
    const eventFolders = fs.readdirSync(eventsPath, { withFileTypes: true });

    eventFolders.forEach((folder) => {
        const folderPath = path.join(eventsPath, folder.name);

        if (!folder.isDirectory()) return;

        const eventFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

        eventFiles.forEach((file) => {
            try {
                const event = require(`${folderPath}/${file}`);
                if (!event || !event.type) {
                    eventCount.failed++;
                    return;
                }

                if (event.once) {
                    client.once(event.type, (...args) => event.run(client, ...args));
                } else {
                    client.on(event.type, (...args) => event.run(client, ...args));
                }

                eventCount.success++;
            } catch (error) {
                console.error(`Erro ao carregar o evento ${file}:`, error);
                eventCount.failed++;
            }
        });
    });

    logSummary.push(`#dim [Events ${eventCount.success}] - #black bold[failed ${eventCount.failed}]`);
}

module.exports = setupEvents;
