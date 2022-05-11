export default {
    data: {
        name: 'debbiedowner',
        description: 'Secret command for secret things.',
        secret: true,
    },
    async execute(message, args) {
        message.delete()
        const member = args[0] ? args[0].replace(/[<@!>]/g, '') : false
        const target = member ? await message.guild.members.fetch(member) : false
        const embed = {
            title: target ? 'caught red-handed.' : 'dude, what?',
            description: target
                ? `looks like ${target}'s been a bit of a debbie downer...`
                : `what the heck are you trying to accomplish by calling yourself a debbie downer, ${message.author}?`,
            footer: {
                text: `Sent by ${message.author.tag}`,
                icon_url: message.author.avatarURL(),
            },
            timestamp: new Date(),
        }

        if (target)
            embed.image = {
                url: 'https://i.imgur.com/h7Mibjc.png',
            }

        return message.channel.send({ embeds: [embed] })
    },
}
