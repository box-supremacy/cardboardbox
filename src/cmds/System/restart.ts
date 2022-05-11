import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageActionRow, MessageButton } from 'discord.js';
import * as util from '../../util.js';
const { OWNERID } = process.env;

export default {
    data: new SlashCommandBuilder().setName('restart').setDescription('Restart the bot.'),
    userPermissions: ['ADMINISTRATOR'],
    async execute(interaction) {
        if(interaction.member.id !== OWNERID) return interaction.editReply('You aren\'t allowed to restart me. Nice try, though.');
        const confirm = new MessageActionRow().addComponents(
            new MessageButton().setCustomId('confirmRestart').setLabel('Confirm').setStyle('DANGER'),
            new MessageButton().setCustomId('cancelRestart').setLabel('Cancel').setStyle('SECONDARY')
        );
        try {
            interaction.client.user.setStatus('idle');

            await interaction.editReply({
                content: '**Are you sure you want to restart me?** Click the button below to proceed.',
                components: [confirm],
            });
            const msg = await interaction.fetchReply();

            const filter = (i) => i.user.id === OWNERID;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });
            collector.on('collect', async (i) => {
                if (i.customId === 'confirmRestart') {
                    util.doRestart(i, msg.channel.id);
                } else {
                    interaction.client.user.setStatus('online');
                    await i
                        .update({ content: '**Restart cancelled.** Deleting this message in 5 seconds.', components: [] })
                        .then((msg) => {
                            try {
                                setTimeout(() => i.deleteReply(), 5000);
                            } catch {}
                        });
                }
            });
        } catch (e) {
            interaction.client.user.setStatus('online');
            interaction.editReply('**Restart failed.**');
        }
    },
};
