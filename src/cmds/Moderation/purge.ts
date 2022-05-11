import { SlashCommandBuilder } from '@discordjs/builders'

export default {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Clear a number of messages in a channel.')
        .addIntegerOption((option) => option.setName('count').setDescription('The number of messages to delete.').setRequired(true)),
    async execute(interaction) {
        const count = interaction.options.get('count').value

        if (count < 1) return interaction.editReply(count === 0 ? "I can't remove zero messages." : "I can't remove a negative amount of messages.")

        let messages = await interaction.channel.messages.fetch({ limit: count, before: interaction.id })

        await interaction.channel.bulkDelete(messages)
        await interaction.editReply(`:white_check_mark: Cleared **${messages.size}** message${messages.size === 1 ? '' : 's'}.`)
        setTimeout(() => interaction.deleteReply().catch(() => {}), 2000)
    },
}
