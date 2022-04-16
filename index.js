const { Client, Intents } = require('discord.js');
const client = new Client({
    intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES],
});

const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const Enmap = require('enmap');
const path = require('path');

client.config = require('./config.js');
client.logger = require('./modules/Logger');

require('./modules/functions.js')(client);
client.commands = new Enmap();
client.aliases = new Enmap();
client.settings = new Enmap({ name: 'settings' });

async function crawl(directory, filesArray) {
    const dirs = await readdir(directory, {
        withFileTypes: true,
    });

    for (let i = 0; i < dirs.length; i++) {
        const currentDir = dirs[i];
        const newPath = path.join(directory, currentDir.name);
        if (currentDir.isDirectory()) {
            await crawl(newPath, filesArray);
        } else {
            filesArray.push(newPath);
        }
    }
}

const init = async () => {
    let cmdFiles = [];
    await crawl('commands', cmdFiles);
    client.logger.log(`Loading a total of ${cmdFiles.length} commands.`);
    cmdFiles.forEach((f) => {
        if (!f.endsWith('.js') || f.startsWith('commands\\_')) return;
        const response = client.loadCommand(f);
        if (response) console.log(response);
    });

    const evtFiles = await readdir('./events/');
    client.logger.log(`Loading a total of ${evtFiles.length} events.`);
    evtFiles.forEach((file) => {
        const eventName = file.split('.')[0];
        client.logger.log(`Loading Event: ${eventName}`);
        const event = require(`./events/${file}`);
        client.on(eventName, event.bind(null, client));
    });

    client.levelCache = {};
    for (let i = 0; i < client.config.permLevels.length; i++) {
        const thisLevel = client.config.permLevels[i];
        client.levelCache[thisLevel.name] = thisLevel.level;
    }

    client.login(client.config.token);
};

init();
