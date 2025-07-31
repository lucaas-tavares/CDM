const { EmbedBuilder } = require('discord.js')

module.exports = {
    id: 'info',
    run: async ({ client, interaction, args }) => {
        const embed = new EmbedBuilder()
        .setColor('#5865f2')
        .setDescription(`
## - → 🧰・Como funciona o comando: \`/recompensar_ajuda\`
-# **Estrutura:**
\`\`\`
/recompensar_ajuda
 destaque: @UsuárioDestaque  
 ajudantes: @User1 @User2
 avaliar: @User1 🔥 @User2 ⭐
\`\`\`
### - → 🏅・**Como funciona \`/recompensar_ajudante\`?**

* **\`destaque:\`**
> Os que **mais te ajudaram**. Respostas completas, claras, com código ou solução real.

* **\`ajudantes:\`**
> Quem **deu uma força**, mas sem fechar a questão sozinho.

* **\`avaliar:\`** *(opcional)*
> Adicione **emojis** para indicar o nível de contribuição de cada ajudante.
> -# Caso essa opção não seja usada:
> -# - **Usuários em destaque** recebem automaticamente o nível 3 - 🔥
> -# - **Usuários ajudantes** recebem automaticamente o nível 2 - ⭐

- → 🌟・ Emojis válidos:
> - → 🔥 - Resposta completa, salvadora (5 a 7 pontos)
> - → ⭐ - Boa contribuição, mas parcial (3 a 5 pontos)
> - → 🌚 - Ajuda pequena ou tentativa (1 a 3 pontos)
            `);
        
        interaction.reply({flags: ['Ephemeral'], embeds: [embed]})
    }
}