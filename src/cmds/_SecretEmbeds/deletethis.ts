export default {
    data: {
        name: 'deletethis',
        description: 'Secret command for secret things.',
        secret: true,
    },
    async execute(message, args) {
        message.delete()
        const embed = {
            title: 'bruh.',
            description: 'delete this immediately.',
            image: {
                url: 'http://i.imgur.com/UqBEBMO.png',
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
