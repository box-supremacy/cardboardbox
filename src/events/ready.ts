import fs from 'fs';
import { exec } from 'child_process';
import { checkUpdates } from '../util.js';
import { DurationFormatter } from '@sapphire/time-utilities';
import { Guild, TextChannel } from 'discord.js';

const f = new DurationFormatter();

export default {
    name: 'ready',
    once: 'true',
    async execute(client) {
        let date = new Date();

        console.log(`\x1b[33m\x1b[1m${client.user.tag}\x1b[22m (${client.user.id}) has started on \x1b[1m${date}\x1b[22m.\x1b[39m`);

        client.user.setActivity(`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} users`, {
            type: 'WATCHING',
        });

        client.user.setStatus('online');

        await checkReboot(client);

        checkUpdates();
    },
};
async function checkReboot(client) {
    if (!fs.existsSync('./rebootinfo')) return;
    let data: any = fs.readFileSync('./rebootinfo');
    data = data.toString().split('\n');

    while (data.length > 2) {
        data.pop();
    }
    const rebootTime = data.shift();
    const rebootChannelId = data.pop();

    const channel = await client.channels.fetch(rebootChannelId);
    await channel.send(`Rebooted in \`${f.format(Date.now() - rebootTime)}\`.`);

    fs.unlinkSync('./rebootinfo');
}
