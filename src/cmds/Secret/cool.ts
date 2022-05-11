export default {
    data: {
        name: 'cool',
        description: 'Secret command for secret things.',
        secret: true,
    },
    async execute(message) {
        message.delete()

        return message.channel.send(
            "wow congrats dude, really, that's very cool. i just told everyone in my family about it, everybody thinks that's very impressive and asked me to congratulate you. they want to speak to you in person, if possible, to give you their regards. they also said they will tell our distant relatives in christmas supper and in NYE they will ignite fireworks that spell your name. i also told about this enormous deed to closer relatives, they had the same reaction. they asked for your address so they can send congratulatory cards and messages. my friends didn't believe me when i told them i knew the author of this gigantic feat, really, they were dumbstruck, they said they will make your name echo through years and years to come. when my neighbor found out about what you did, he was completely dumbstruck too, he wanted to know who you are and he asked (if you have the time, of course) if you could stop by to receive gifts, congratulations, and handshakes. with the spreading of the news, a powerful businessman of the area decided to hire you as the CEO of his company because of this tremendous feat and at the same time an important international shareholder wants to sponsor you to give speeches and teach everybody how to do as you did so the world becomes a better place. you have become famous not only here but also everywhere, everybody knows who you are. the news spread really fast and mayors of all cities are setting up porticos, ballons, colossal boom speakers, anything that can make your name stand out more and see which city can congratulate you the hardest for this magnificent feat. here in my city, all the streets will be renamed after you beginning at the next mayoral term. a lot of countries that frowned upon ours, now, thanks to your deed, see us as a role model, a new hope. the lucky people who know about you say \"hey, that guy is my compatriot!\""
        )
    },
}
