import mongoose from 'mongoose';
import * as db from '../db/Mongo.js';

export default {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember) {
        const guild = await db.fetchGuild(newMember.guild.id);
        if (!newMember.pending && guild.addons.screeningRoles.length > 0) {
            newMember.roles.add(guild.addons.screeningRoles);
            // logChannel.send(`${newMember.user} has completed the membership screening.`);
        }
    },
};
