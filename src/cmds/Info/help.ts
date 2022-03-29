import { SlashCommandBuilder } from '@discordjs/builders';

export default {
    data: new SlashCommandBuilder().setName('help').setDescription('Get basic info of the bot.'),
    async execute(interaction) {
        const { client, member } = interaction;
        const { user } = client;
        const { id, username, discriminator } = user;

        const helpEmbed = {
            description: `${username}#${discriminator}`,
            thumbnail: { url: user.displayAvatarURL() },
            fields: [
                {
                    name: 'Bot ID',
                    value: id,
                    inline: true,
                },
                {
                    name: 'Bot Name',
                    value: username,
                    inline: true,
                },
                {
                    name: 'Bot Discriminator',
                    value: discriminator,
                    inline: true,
                },
                {
                    name: 'Library',
                    value: 'Discord.js',
                    inline: true,
                },
                {
                    name: 'Library Version',
                    value: '13.3.1',
                    inline: true,
                },
                {
                    name: 'Language',
                    value: 'JavaScript',
                    inline: true,
                },
                {
                    name: 'Path',
                    value: 'commands/Info/help.js',
                    inline: true,
                },
            ],
        };

        await interaction.reply({ embeds: [helpEmbed] });
    },
};
