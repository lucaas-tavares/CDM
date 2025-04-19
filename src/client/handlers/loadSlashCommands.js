const fs = require('fs');
const path = require('path');

function loadSlashCommands(client, logSummary) {
    const commandCount = { success: 0, failed: 0 };
    const SlashsArray = [];

    const commandsPath = path.resolve(__dirname, '../../discord/commands/slash');
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

                client.commands.set(command.name, command);
                SlashsArray.push(command);
                commandCount.success++;
            } catch (error) {
                console.error(`Erro ao carregar o comando ${file}:`, error);
                commandCount.failed++;
            }
        });
    });

    logSummary.push(
        `#dim[Slash ${commandCount.success}] - #bold black[failed ${commandCount.failed}]`
    );

    client.on("ready", async () => {
        await client.application.commands.set(SlashsArray);
    });

    return client.commands;
}

module.exports = loadSlashCommands;