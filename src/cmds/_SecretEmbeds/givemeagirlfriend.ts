export default {
    data: {
        name: 'givemeagirlfriend',
        description: 'Secret command for secret things.',
        secret: true,
    },
    async execute(message) {
        message.delete()
        return message.reply('No.')
    },
}
