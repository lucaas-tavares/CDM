const { ActionRowBuilder, ButtonBuilder } = require("discord.js");

const LANGUAGE_TAG_ROLES = {
    'Javascript & nodejs': '1371551152071770233',
    'Typescript': '1371551146967171260',
    'Html & Css': '1371551143595085955',
    'Java': '1371551133096476783',
    'C': '1371551128558375013',
    'C#': '1371551125190213802',
    'C++': '1371551121167880224',
    'Php': '1371551115971395594',
    'Golang': '1371551112800501851',
    'Rust': '1371551108253876356',
    'Python': '1371551104604835982'
};

module.exports = {
    type: 'threadCreate',
    run: async (client, thread) => {
        if (thread.parentId === '1357548928622395562') {
            try {
                const appliedTags = thread.appliedTags || [];
                const forumTags = await thread.parent.availableTags;
                
                const languageMentions = [];
                for (const tagId of appliedTags) {
                    const tag = forumTags.find(t => t.id === tagId);
                    if (tag && LANGUAGE_TAG_ROLES[tag.name]) {
                        languageMentions.push(`<@&${LANGUAGE_TAG_ROLES[tag.name]}>`);
                    }
                }
                const button = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`info:${thread.ownerId}`)
                        .setLabel('→ Info')
                        .setStyle(2)
                );

                await thread.send({
                    content: `
## ☕・Seu pedido está na fila!
Enquanto espera por ajuda, que tal uma xícara de café?

-# **Como finalizar:**
→ \`/recompensar_ajuda\` (Se alguém te ajudou)
> -# Aperte no botão __Info__, para saber mais
→ \`/finalizar\` (Se resolveu sozinho)
_ _ 
> ❒ — Equipe </Coffee Dimension>
`,
                    components: [button]
                });

                if (languageMentions.length > 0) {
                    const mentionMsg = await thread.send({
                        content: `> - 📢 → **Ping:** ${languageMentions.join(' ')}`
                    });

                    setTimeout(async () => {
                        try { await mentionMsg.delete(); } 
                        catch (e) { console.error('Erro ao apagar menção:', e); }
                    }, 1000 * 10);
                }

            } catch (error) {
                console.error('Erro:', error);
                await thread.send(`## ☕・Post criado!`);
            }
        }
    }
}