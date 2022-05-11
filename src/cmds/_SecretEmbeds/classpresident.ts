export default {
    data: {
        name: 'classpresident',
        description: 'Secret command for secret things.',
        secret: true,
    },
    async execute(message, args) {
        message.delete()
        const embed = {
            title: 'Class President Activist Speech',
            description: `**INTRODUCTION:** Good morning, Student Council. My name is **${
                message.member.nickname ? message.member.nickname : message.author.username
            }**, for those who are not familiar with me, I'm not the type of student who will “slapbox” you in the halls, or skip class with you, but that probably isn't what you want in a student council president anyway. I am the type of student who is a hard-working, determined, energetic student with the ability to work with others, even during hard times, while still having a sense of humor. MY **CREDENTIALS:** During the last two years at the rhearmas school of comedy, I've been involved in many activities. In 2015, I organized the Scholastic Book Writing team, and hopped on board this council. In 2016, I worked side-by-side with old woman mcunfunny on the winter book fair and helped out with the canned food drive during Thanksgiving. In 2017, during the summer, I volunteered at a soup kitchen in A VERY BAD TOWN IN NEW YORK, and quite recently, in September, gave routine updates on Hurricane Irma, people thought I was speaking in a different language, unfortunately. However, for the last two quarters, (the 4th of 2016-17, and 1st of this year), I had consecutive straight A's. I hope to continue that for the rest of this year. **WHAT I'LL DO FOR YOU:** As your student council president, I vow to have free pizza every Friday. Just kidding. I can't do that, but what I can do is be your voice with the school administration and work to make this the best year Soldishibe Productions has ever had. I will introduce ideas for events, such as, during the Winter Dance, perhaps a song request board, or even a stand-alone end-of-year party, completely done by this council. **ASK FOR THE VOTE:** Each vote is important, and if elected, I will continue to push for the things that are important to students, no matter how big or small they might be. Let's work together to make our stamp on this community and on the world. Thank you for your time, that is all.`,
            footer: {
                text: `Sent by ${message.author.tag}`,
                icon_url: message.author.avatarURL(),
            },
            timestamp: new Date(),
        }

        return message.channel.send({ embeds: [embed] })
    },
}
