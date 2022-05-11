export default {
    data: {
        name: 'xd',
        description: 'Secret command for secret things.',
        secret: true,
    },
    async execute(message, args) {
        message.delete()
        const embed = {
            title: 'haha! Lol!!',
            description: "haha! you're so funny!! <a:xd:438471448311496704>",
            image: {
                url: 'http://i.imgur.com/B1FoUEp.jpg',
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
