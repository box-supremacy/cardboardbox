import { SlashCommandBuilder } from '@discordjs/builders';

export default {
    data: new SlashCommandBuilder().setName('commandName').setDescription('Command description'),
    async execute(interaction) {
        // Code to execute goes here
    },
};
