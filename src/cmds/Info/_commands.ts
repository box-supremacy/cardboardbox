import { SlashCommandBuilder } from '@discordjs/builders';
import fs from 'fs';
import path from 'path';

export default {
    data: new SlashCommandBuilder().setName('commands').setDescription('Get a list of all bot commands.'),
    async execute(interaction) {
        const commands = fs.readdirSync(path.join(__dirname, '../../cmds'));
        const categories = {};

        for (const command of commands) {
            const category = command.split('/')[0];
            if (!categories[category]) categories[category] = [];
            categories[category].push(command);
        }

        const embed = {
            title: 'Commands',
            description: '',
            fields: [],
        };

        for (const category in categories) {
            embed.description += `**${category}**\n`;
            for (const command of categories[category]) {
                embed.description += `- ${command.split('/')[1]}\n`;
            }
        }
        interaction.reply(embed);
    },
};
