import { fetchGuild } from '../db/Mongo.js';

export default {
    name: 'guildCreate',
    async execute(guild) {
        await fetchGuild(guild.id);
        guild = await guild.fetch();
        console.log(`Added ${guild.name} to the database.`);
    },
};
