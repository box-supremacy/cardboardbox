import mongoose from 'mongoose';
import * as db from '../db/Mongo.js';

export default {
    name: 'guildMemberRemove',
    async execute(member) {
        const guild = await db.fetchGuild(member.guild.id);
        if (!guild.addons.greeter.enabled) return console.log(`${member.user.tag} (${member.id}) left ${member.guild.name}.`);
        if (guild.addons.greeter.leaveMessages.length < 1)
            return console.log(`${member.user.tag} (${member.id}) left ${member.guild.name}, but there are no join messages.`);

        const channel = member.guild.channels.cache.get(guild.addons.greeter.channel);
        if (!channel) return console.log(`${member.user.tag} (${member.id}) left ${member.guild.name}, but there is no greet channel.`);

        const leaveMessages = guild.addons.greeter.leaveMessages.map((m) =>
            m.replace(/\{user\}/g, member.user.tag).replace(/\{mention\}/g, member.user.toString())
        );
        let leaveMessage = leaveMessages[Math.floor(Math.random() * leaveMessages.length)];

        return channel.send({
            content: leaveMessage,
            allowedMentions: {
                parse: ['users'],
            },
        });
    },
};
