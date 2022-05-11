export default {
    data: {
        name: 'whoosh',
        description: 'Secret command for secret things.',
        secret: true,
    },
    async execute(message) {
        message.delete()
        const image = 'http://i.imgur.com/T4Q2CST.png'
        const embed = {
            title: 'the joke?',
            description: '*whoosh*',
            image: {
                url: image,
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
