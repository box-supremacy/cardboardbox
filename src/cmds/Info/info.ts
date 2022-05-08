import { SlashCommandBuilder } from '@discordjs/builders'
// import * as packageJSON from '../../../package.json' assert { type: 'json' }

export default {
    data: new SlashCommandBuilder().setName('info').setDescription('Get basic info of the bot.'),
    async execute(interaction) {
        const { client, member } = interaction
        const { user } = client
        const { id, username, discriminator } = user

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
                    value: '13.6.0',
                    inline: true,
                },
                {
                    name: 'Language',
                    value: 'TypeScript',
                    inline: true,
                },
            ],
        }

        await interaction.reply({ embeds: [helpEmbed] })
    },
}
