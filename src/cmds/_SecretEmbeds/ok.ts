export default {
    data: {
        name: 'ok',
        description: 'Secret command for secret things.',
        secret: true,
    },
    async execute(message, args) {
        message.delete()
        const embed = {
            title: 'ok',
            description: 'ok',
            image: {
                url: 'http://i.imgur.com/g1PjqMn.jpg',
            },
            footer: {
                text: `Sent by ${message.author.tag}`,
                icon_url: message.author.avatarURL(),
            },
            timestamp: new Date(),
        }

        return message.channel.send({ embeds: [embed] })
    },
}
