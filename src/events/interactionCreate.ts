import { fetchGuild, fetchPermission } from '../db/Mongo.js';

export default {
    name: 'interactionCreate',
    async execute(interaction) {
        await interaction.deferReply();
        await fetchGuild(interaction.guild.id);
        const command = interaction.client.commands.get(interaction.commandName);

        if (interaction.isCommand()) {
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
