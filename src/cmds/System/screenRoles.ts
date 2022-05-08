import { SlashCommandBuilder } from '@discordjs/builders';
import * as db from '../../db/Mongo.js';

export default {
    data: new SlashCommandBuilder()
        .setName('screenroles')
        .setDescription('Manage the roles to grant to a user when they complete the membership screening.')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('add')
                .setDescription('Add a role to the list of roles to grant to a user when they complete the membership screening.')
                .addRoleOption((arg) => {
                    return arg.setName('role').setDescription('The role to add.').setRequired(true);
                })
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('remove')
                .setDescription(
                    'Remove a role from the list of roles to grant to a user when they complete the membership screening.'
                )
                .addRoleOption((arg) => {
                    return arg.setName('role').setDescription('The role to remove.').setRequired(true);
                })
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('list')
                .setDescription('List the roles to grant to a user when they complete the membership screening.')
        ),

    async execute(interaction) {
        switch (interaction.options.getSubcommand()) {
            case 'add':
                var didItWork = await db.addScreeningRole(interaction.options.get('role').value, interaction.guild.id);
                console.log(didItWork);
                await interaction.reply(
                    didItWork
                        ? `Added **<@&${interaction.options.get('role').value}>** to the screening completion roles.`
                        : 'That role already exists in the screening roles list!'
                );
                break;
            case 'remove':
                var didItWork = await db.deleteScreeningRole(interaction.options.get('role').value, interaction.guild.id);
                await interaction.reply(
                    didItWork
                        ? `Removed **<@&${interaction.options.get('role').value}>** from the screening completion roles.`
                        : "That role doesn't exist in the screening roles list!"
                );
                break;
            case 'list':
                const roles = await db.fetchScreeningRoles(interaction.guild.id);
                if (roles.length > 0) {
                    const rolesList = roles.map((role) => `<@&${role}>`).join(', ');
                    await interaction.reply(
                        `The following ${
                            roles.length > 1 ? 'roles' : 'role'
                        } will be granted new members complete the membership screening: ${rolesList}`
                    );
                } else {
                    await interaction.reply(
                        "From the looks of it, I won't be giving new users any roles when they complete the screening."
                    );
                }
                break;
        }
    },
};
