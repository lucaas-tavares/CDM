const fs = require('fs');
const path = require('path');

function loadPrefixCommands(client, logSummary) {
    const commandCount = { success: 0, failed: 0 };

    const commandsPath = path.resolve(__dirname, '../../discord/commands/prefix');
    const directories = fs.readdirSync(commandsPath);

    directories.forEach((dir) => {
        const commandFiles = fs
            .readdirSync(`${commandsPath}/${dir}`)
            .filter((file) => file.endsWith('.js'));

        commandFiles.forEach((file) => {
            try {
                const command = require(`${commandsPath}/${dir}/${file}`);
                if (!command || !command.name) {
                    commandCount.failed++;
                    return;
                }

                client.prefixCommands.set(command.name, command);
                commandCount.success++;
            } catch (error) {
                console.error(`Erro ao carregar o comando ${file}:`, error);
                commandCount.failed++;
            }
        });
    });

    logSummary.push(`#dim [ Prefix ${commandCount.success}] - #bold black [failed ${commandCount.failed}]`);

    return client.prefixCommands;
}

module.exports = loadPrefixCommands;
