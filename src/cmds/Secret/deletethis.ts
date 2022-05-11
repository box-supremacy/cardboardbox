export default {
    data: {
        name: 'deletethis',
        description: 'Secret command for secret things.',
        secret: true,
    },
    async execute(message, args) {
        message.delete()

        return message.channel.send({ content: 'delete this immediately.', files: ['http://i.imgur.com/UqBEBMO.png'] })
    },
}
