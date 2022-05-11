export default {
    data: {
        name: 'xd',
        description: 'Secret command for secret things.',
        secret: true,
    },
    async execute(message, args) {
        message.delete()

        return message.channel.send({ content: "haha! you're so funny!! <a:xd:438471448311496704>", files: ['http://i.imgur.com/B1FoUEp.jpg'] })
    },
}
