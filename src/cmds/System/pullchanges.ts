import { SlashCommandBuilder } from '@discordjs/builders';
import { exec } from 'child_process';

export default {
    data: new SlashCommandBuilder().setName('pullchanges').setDescription("Attempts to pull changes from the bot's Git repo."),
    async execute(interaction) {
        await interaction.deferReply();
        const data = exec(`./autopull.sh`, function (err, data) {
            interaction.editReply(data);
        });
    },
};
