export default {
    data: {
        name: 'smartphone',
        description: 'Secret command for secret things.',
        secret: true,
    },
    async execute(message, args) {
        message.delete()
        const embed = {
            title: 'intriguing devices.',
            description:
                "the world we live in. it's so... wonderous. mysterious. even magical. no... no no no.. not that world. i meant this one. the smartphone. each system and program app is it's own little planet of perfect. technology. all providing services so necessary, so crucial, so unbelievably profound. look who just sent me a text! addie mccallister? it must be a mistake. or a joke. or a scam! don't send her your social security number. she's right there! that's our user, alex. and, like every freshman in high school, his whole life, everything, revolves around his phone. and, because the pace of life gets, faster and faster... phones down in five. and attention spans get shorter and shorter... and... you're probably not even listening to me right now. who has the time to type out actual words? and that's where we come in. the most important invention in the history of communication! emo gees. that's my home! textopolis. here, each of us does one thing, and we have to nail it every time. christmas tree just has to stand there, all festive. merry christmas! it's still september, tim! and princesses... i am so pretty. they just gotta wear their crowns and keep their hair comb. we are so pretty. devil, poop, thumbs up, they just show up and they're good to go. but for the faces, the pressure is on. cryer always has to cry, even if he just won the lottery. hurray, i'm a millionaire! laugher's always laughing, even if he's just broken his arm. ahh!! ah! i can see the bone!! ah ah ah ah ah... and me, i'm a meh. so i gotta totally be over it all the time, you know? like meh, who cares. which is not as easy as it sounds. i gotta be mehhhhh i GOTTA! be! mehhhhh morning misses D, i see you have the little minis with ya! oh, they're so... cute! NYAH, SO ADORABLE, I CAN'T TAKE IT! I WILL NEVER GET THEM TO SLEEP! **STICK TO YOUR ONE FACE, WEIRDO. OLE! OLE! OH NO! OH NO!**",
            footer: {
                text: `Sent by ${message.author.tag}`,
                icon_url: message.author.avatarURL(),
            },
            timestamp: new Date(),
        }

        return message.channel.send({ embeds: [embed] })
    },
}
