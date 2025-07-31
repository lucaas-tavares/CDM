const {
  EmbedBuilder,
  WebhookClient,
  AttachmentBuilder,
} = require('discord.js');
const { inspect } = require('util');
const { config } = require('../../client/config');

const webhook = new WebhookClient({ url: config.webhookURL });

const sendError = (t, reason, promise = null) => {
  console.log(`[${t}]`, reason, promise ?? '');

  const parsedReason = inspect(reason, { depth: 1 }) || '**<:1erro:1327469106500472944>  - Sem motivo**';
  const parsedPromise = promise ? inspect(promise, { depth: 1 }) : null;

  const errorEmbed = new EmbedBuilder()
    .setColor(0xdd233f)
    .setTimestamp()
    .setDescription(
      `## -# > **${t}** \n- **<:2MegaPhone:1336522377596768277> - Motivo do erro:**\n\`\`\`${parsedReason.slice(
        0,
        1000
      )}\`\`\``
    );


  if (parsedPromise) {
    errorEmbed.addFields({
      name: '- Promise',
      value: `\`\`\`${parsedPromise.slice(0, 1000)}\`\`\``,
    });
  }

  webhook
    .send({
      content: `> - <@1005290241743143043> - Um erro selvagem apareceu!`,
      embeds: [errorEmbed],
    })
    .catch(() => {
      const text =
        `[${t}]\n\n` +
        `Reason:\n${parsedReason}\n\n` +
        (parsedPromise ? `Promise:\n${parsedPromise}` : '');

      const attachment = new AttachmentBuilder(Buffer.from(text), {
        name: 'Error.txt',
      });

      webhook.send({ files: [attachment] });
    });
};

process.on('unhandledRejection', (reason, promise) => {
  sendError('Unhandled Rejection', reason, promise);
});

process.on('uncaughtException', (error) => {
  sendError('Uncaught Exception', error);
});
