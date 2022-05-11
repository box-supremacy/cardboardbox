import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageActionRow, MessageButton } from 'discord.js'
import * as util from 'util'
import * as funcs from '../../util.js'

export default {
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Runs a command through standard JavaScript.')
        .addStringOption((option) => option.setName('code').setDescription('Code to evaluate.').setRequired(true)),
    async execute(interaction) {
        if(interaction.user.id !== process.env.OWNERID) return interaction.editReply('Nice try.')

        try {
            const code = interaction.options.get('code').value
            let evaled = eval(code)

            if (typeof evaled !== 'string') {
                evaled = util.inspect(evaled)
            }

            if (evaled.length > 2000) {
                let link: any = false
                link = await funcs.bin(evaled)
                if (!link) return interaction.editReply("Output was longer than 2000 characters, but `hst.sh` didn't give me anything.")

                const row = new MessageActionRow().addComponents(new MessageButton().setStyle('LINK').setURL(link).setLabel('Output (hst.sh)'))

                return interaction.editReply({
                    content: 'Output was longer than 2000 characters.',
                    components: [row],
                })
            }

            interaction.editReply(`\`\`\`js\n${evaled}\n\`\`\``, { code: 'xl' })
        } catch (error) {
            interaction.editReply(`\`\`\`js\n${error}\n\`\`\``, { code: 'xl' })
        }
    },
};
