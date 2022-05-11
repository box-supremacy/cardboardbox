export default {
    data: {
        name: 'funny',
        description: 'Secret command for secret things.',
        secret: true,
    },
    async execute(message, args) {
        message.delete()
        const member = args[0] ? args[0].replace(/[<@!>]/g, '') : false
        const target = member ? await message.guild.members.fetch(member) : false

        return message.channel.send({
            content: target
                ? `${target}, why don't you have a seat over there?`
                : `why the heck are you trying to make yourself sit down, ${message.author}?`,
            files: ['https://i.imgur.com/dopNkpQ.png'],
        })
    },
}
