import GuildSchema from './schema/Guild.js';
import { arrayExists } from '../util.js';

const { OWNERID } = process.env;

/**
 * Fetch a guild from the database by its ID. If the guild does not exist, it will be created.
 * @param {string} key The ID of the guild.
 * @returns {Promise<GuildSchema>} Guild object from database.
 */
export async function fetchGuild(key) {
    let guildDB = await GuildSchema.findOne({ id: key });
    if (guildDB) return guildDB;
    else {
        guildDB = new GuildSchema({
            id: key,
            registeredAt: Date.now(),
            addons: {
                screeningRoles: [],
            },
        });

        await guildDB.save().catch((err) => console.log(err));
        return guildDB;
    }
}

/**
 * Fetch the member permission from a guild. Returns true if it exists on the user, false otherwise.
 * @param {string} user The user to check
 * @param {string} guild The guild of the interaction
 * @param {string} type The type of permission: mod, admin, owner
 */
export async function fetchPermission(user, guild, type, client) {
    guild = await fetchGuild(guild);
    let target = await client.guilds.fetch(guild.id);
    target = await target.members.fetch(user);

    const isMod = await arrayExists(guild.roles.mod, (role) => role === target);
    const isAdmin = await arrayExists(guild.roles.admin, (role) => role === target);
    const isOwner = target.id === OWNERID;

    if (type === 'owner') return isOwner;
    if (type === 'admin') return isAdmin || isOwner;
    if (type === 'mod') return isMod || isAdmin || isOwner;
}

// Grab all roles that are added when users complete the screening. Returns null if no roles are found
export async function fetchScreeningRoles(guildId) {
    const guild = await fetchGuild(guildId);
    return guild.addons.screeningRoles;
}

export async function addScreeningRole(role, guildId) {
    const guild = await fetchGuild(guildId);

    const index = guild.addons.screeningRoles.indexOf(role);
    if (index < 0) {
        guild.addons.screeningRoles.push(role);
        await guild.save();
        return true;
    } else return false;
}

export async function deleteScreeningRole(role, guildId) {
    const guild = await fetchGuild(guildId);

    const index = guild.addons.screeningRoles.indexOf(role);
    if (index > -1) {
        guild.addons.screeningRoles.splice(index, 1);
        await guild.save();
        return true;
    } else return false;
}
