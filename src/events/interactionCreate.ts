import { fetchGuild, fetchPermission } from '../db/Mongo.js';

export default {
    name: 'interactionCreate',
    async execute(interaction) {
        await fetchGuild(interaction.guild.id);
        const command = interaction.client.commands.get(interaction.commandName);

        if (interaction.isCommand()) {
            if (
                command.requires &&
                !(await fetchPermission(interaction.member.id, interaction.guild.id, command.requires, interaction.client))
            ) {
                return interaction.reply({
                    content: 'You do not have the required permissions to use this command.',
                    ephemeral: true,
                });
            }

            try {
                await command.execute(interaction);
            } catch (e) {
                console.log(e);
                if (interaction.deferred || interaction.replied)
                    return interaction.editReply({ content: 'There was an error while executing this command.', ephemeral: true });
                else return interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
            }
        }
    },
};
