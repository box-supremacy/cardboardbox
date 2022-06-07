import mongoose from 'mongoose';
import * as db from '../db/Mongo.js';

export default {
    name: 'guildMemberAdd',
    async execute(member) {
        const guild = await db.fetchGuild(member.guild.id);
        if (!guild.addons.greeter.enabled) return console.log(`${member.user.tag} (${member.id}) joined ${member.guild.name}.`);
        if (guild.addons.greeter.joinMessages.length < 1)
            return console.log(`${member.user.tag} (${member.id}) joined ${member.guild.name}, but there are no join messages.`);

        const channel = member.guild.channels.cache.get(guild.addons.greeter.channel);
        if (!channel) return console.log(`${member.user.tag} (${member.id}) joined ${member.guild.name}, but there is no greet channel.`);

        const joinMessages = guild.addons.greeter.joinMessages.map((m) =>
            m.replace(/\{user\}/g, member.user.tag).replace(/\{mention\}/g, member.user.toString())
        );
        let joinMessage = joinMessages[Math.floor(Math.random() * joinMessages.length)];
        let dmJoinMessage = guild.addons.greeter.dmGreet.message
            .replace(/\{user\}/g, member.user.tag)
            .replace(/\{mention\}/g, member.user.toString())
            .replace(/\{server\}/g, member.guild.name)
            .replace(/\\n/g, '\n');

        await channel.send({
            content: joinMessage,
            allowedMentions: {
                parse: ['users'],
            },
        });
        if (!guild.addons.greeter.dmGreet.enabled) return;
        try {
            await member.send({
                content: dmJoinMessage,
                allowedMentions: {
                    parse: ['users'],
                },
            });
        } catch (e) {
            console.log(e);
        }
    },
};
