export default {
    data: {
        name: 'mod',
        description: 'Secret command for secret things.',
        secret: true,
    },
    async execute(message) {
        message.delete()
        const embed = {
            title: 'Silly. So silly',
            description: `${message.author}, you silly boy. Do you have any clue what you've just done? You may think that you're a moderator/administrator who can do anything. The truth is: all powers have limits, and in fact, you've just crossed the line. You probably think that muting somebody will be entirely harmless and nothing will happen afterwards. Guess what buddy, I have 90 gmail accounts and I am prepared to use every single one of them to haunt you: spamming you FNaF images and vast quantities of hideous NSFW content. I could actually raid this server 90 times, eventually the server will be up in flames to the extent at which the every single user in authority will agree to transfer the ownership of this server to me, you will surrender after I give this server the biggest trip anything discord server has experienced. You muted the wrong person kiddo. And that's not even a joke. In fact, if you ban all the accounts, I'll make more. Keep raiding and raiding until you are powerless. Once I become the owner I will turn this into a FNaF server and rapidly dominate landscapes throughout all discord. Bad decision mate.`,
            footer: {
                text: `Sent by ${message.author.tag}`,
                icon_url: message.author.avatarURL(),
            },
            timestamp: new Date(),
        }
        message.channel.send({ embeds: [embed] })
    },
}
