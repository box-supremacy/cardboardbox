export default {
    data: {
        name: 'yourhairisgettingshaggy',
        description: 'Secret command for secret things.',
        secret: true,
    },
    async execute(message, args) {
        message.delete()
        const member = args[0] ? args[0].replace(/[<@!>]/g, '') : false
        const target = member ? await message.guild.members.fetch(member) : false
        const embed = {
            title: target ? 'Odd...' : "That's some shaggy hair.",
            description: target
                ? `Hey ${target}, I'm not being rude, I'm stating a fact, you've been baited. You just have. There's nothing else to it. There's no reason for you to believe that this was going to be a Brisk joke. If you tell me "I miss the Brisk commands!", I'll laugh at you and I'll shame you. How dare you have different taste in copypastas than I, a hater of the Brisk Copypasta? If you like commands such as \`${process.env.BOT_PREFIX}swoop\`, even just for fun, I'll spit on you.`
                : `I get that you have shaggy hair, ${message.author}, but is insulting yourself really a good option?`,
            footer: {
                text: `Sent by ${message.author.tag}`,
                icon_url: message.author.avatarURL(),
            },
            timestamp: new Date(),
        }

        return message.channel.send({ embeds: [embed] })
    },
}
