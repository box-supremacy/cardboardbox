export default {
    data: {
        name: 'ok',
        description: 'Secret command for secret things.',
        secret: true,
    },
    async execute(message, args) {
        message.delete()

        return message.channel.send({ content: 'ok', files: ['http://i.imgur.com/g1PjqMn.jpg'] })
    },
}
