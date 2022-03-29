import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageActionRow, MessageSelectMenu } from 'discord.js';

export default {
    data: new SlashCommandBuilder().setName('config').setDescription('Configure the guild settings.'),
    requires: 'mod',
    async execute(interaction) {
        const mainEmbedRow = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId('configCategory')
                .setPlaceholder('Configure...')
                .addOptions([
                    {
                        label: 'Moderation',
                        description: 'Moderation-based settings.',
                        value: 'config_moderation',
                    },
                    {
                        label: 'Roles',
                        description: 'Role permissions.',
                        value: 'config_roles',
                    },
                ])
        );

        if (!interaction.guild.available)
            return interaction.reply(
                "Looks like I couldn't fetch the guild - check if Discord is currently down.\nhttps://status.discord.com"
            );
        interaction.reply({ embeds: [mainEmbed(interaction.guild)], components: [mainEmbedRow] });
    },
};

function mainEmbed(guild) {
    return {
        title: `Local settings for ${guild.name}`,
        description: 'Select a menu from the dropdown.',
        fields: [
            {
                name: 'Moderation',
                value: 'Nothing here yet!',
                inline: true,
            },
            {
                name: 'Roles',
                value: 'Role permissions.',
                inline: true,
            },
        ],
    };
}
