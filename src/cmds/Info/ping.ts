import { SlashCommandBuilder } from '@discordjs/builders';

export default {
    data: new SlashCommandBuilder().setName('ping').setDescription("Check the bot's response time to Discord."),
    async execute(interaction) {
        try {
            interaction.reply(`Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(interaction.client.ws.ping)}ms`);
        } catch (e) {
            interaction.reply('An error occurred while pinging the bot. Check the console for details.');
            console.log(e);
        }
    },
};
