export default {
    data: {
        name: 'swoop',
        description: 'Secret command for secret things.',
        secret: true,
    },
    async execute(message, args) {
        message.delete()

        return message.channel.send(
            "Excuse me, but could you swoop the stream please? I'd like to go down to the soup store real quick and buy a couple bottles of Brisk® Iced Soup. I think I'll get a Lemon Iced Soup®, a Peach Iced Soup®, and maybe even a Pink Soup®. Thanks so much, and I'll let you know when I die."
        )
    },
}
