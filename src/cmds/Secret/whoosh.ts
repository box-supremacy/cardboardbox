export default {
    data: {
        name: 'whoosh',
        description: 'Secret command for secret things.',
        secret: true,
    },
    async execute(message) {
        message.delete()

        return message.channel.send({ content: '*whoosh*', files: ['http://i.imgur.com/T4Q2CST.png'] })
    },
}
