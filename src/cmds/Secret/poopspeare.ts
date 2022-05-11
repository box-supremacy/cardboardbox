export default {
    data: {
        name: 'poopspeare',
        description: 'Secret command for secret things.',
        secret: true,
    },
    async execute(message, args) {
        message.delete()

        return message.channel.send(
            '*pftt* Oh shame, a putrid smell! Poop! HAHAHA! Poopies, comical poopies, lalalala HAHA! Humourous poop! Poop laughable! Ay! Haha, yea for thy poopy, valorous poopy! Poopy jestful! HAHAHAHAHA! Poop poop poop poop poop poop poop, ‘tis jocular, ay! Boisterous, rambunctious poop, haha! Poop poopy, ay! Poop impels thee blithe, o buoyant gayness! Heigh- ho, me thinks thou contrived a poopy! Pooping breeches, no nappy, quite comedic! Alas… poopy loins! We have to hast thine poopies, we CRAVE thy poopies! HAHAHAHA! Poop!!'
        )
    },
}
