export default {
    data: {
        name: 'funny',
        description: 'Secret command for secret things.',
        secret: true,
    },
    async execute(message, args) {
        message.delete()
        const member = args[0] ? args[0].replace(/[<@!>]/g, '') : false
        const target = member ? await message.guild.members.fetch(member) : false
        const image = 'https://i.imgur.com/dopNkpQ.png'
        const embed = {
            title: target ? 'sit down.' : 'huh?',
            description: target
                ? `${target}, why don't you have a seat over there?`
                : `why the heck are you trying to make yourself sit down, ${message.author}?`,
            footer: {
                text: `Sent by ${message.author.tag}`,
                icon_url: message.author.avatarURL(),
            },
            timestamp: new Date(),
        }

        if (target)
            embed.image = {
                url: image,
            }

        return message.channel.send({ embeds: [embed] })
    },
}
