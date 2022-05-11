export default {
    data: {
        name: 'debbiedowner',
        description: 'Secret command for secret things.',
        secret: true,
    },
    async execute(message, args) {
        message.delete()
        const member = args[0] ? args[0].replace(/[<@!>]/g, '') : false
        const target = member ? await message.guild.members.fetch(member) : false

        return message.channel.send({
            content: target
                ? `looks like ${target}'s been a bit of a debbie downer...`
                : `what the heck are you trying to accomplish by calling yourself a debbie downer, ${message.author}?`,
            files: ['https://i.imgur.com/h7Mibjc.png'],
        })
    },
}
