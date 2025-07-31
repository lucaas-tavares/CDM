module.exports = {
    type: 'userUpdate',
    run: async (client, oldUser, newUser) => {
        const guildId = '1327425233388568576';
        const roleId = '1336520293711089694';
        const channelId = client.config.logChannel;
        const keyWord = 'cdm';

        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            console.error('[USER UPDATE] - Servidor não encontrado.');
            return;
        }

        const member = guild.members.cache.get(newUser.id);
        if (!member) {
            return;
        }

        const role = guild.roles.cache.get(roleId); 
        if (!role) {
            console.error(' [USER UPDATE] - O cargo não foi encontrado.');
            return;
        }

        const channel = guild.channels.cache.get(channelId);
        if (!channel) {
            console.error('O canal não foi encontrado.');
            return;
        }

        const oldUsername = oldUser.username;
        const newUsername = newUser.username;

        const oldDisplayName = oldUser.globalName || oldUsername;
        const newDisplayName = newUser.globalName || newUsername;

        const oldUsernameLower = oldUsername.toLowerCase();
        const newUsernameLower = newUsername.toLowerCase();
        const oldDisplayNameLower = oldDisplayName.toLowerCase();
        const newDisplayNameLower = newDisplayName.toLowerCase();

        const keywordAdded =
            (!oldUsernameLower.includes(keyWord) && newUsernameLower.includes(keyWord)) ||
            (!oldDisplayNameLower.includes(keyWord) && newDisplayNameLower.includes(keyWord));

        const keywordRemoved =
            (oldUsernameLower.includes(keyWord) && !newUsernameLower.includes(keyWord)) ||
            (oldDisplayNameLower.includes(keyWord) && !newDisplayNameLower.includes(keyWord));

        if (keywordAdded) {
            try {
                await member.roles.add(role);
                channel.send(client.formatEmoji(`#e:correto Cargo adicionado ao usuário ${newUser}\n-# O usuário adicionou a keyword \`[ ${keyWord} ]\`.`));
            } catch (error) {
                console.error('[USER UPDATE] - Erro ao adicionar cargo:', error);
            }
        } else if (keywordRemoved) {
            try {
                await member.roles.remove(role);
                channel.send(client.formatEmoji(`#e:errado Cargo removido do usuário ${newUser}\n-# O usuário removeu a keyword \`[ ${keyWord} ]\`.`));
            } catch (error) {
                console.error('[USER UPDATE] - Erro ao remover cargo:', error);
            }
        }
    }
};