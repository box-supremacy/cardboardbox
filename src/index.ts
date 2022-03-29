import { Client, Collection, Intents, MessageEmbed } from 'discord.js';
const client: any = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS] });

// Basic imports
import { exec } from 'child_process';
import { readdirSync, statSync, readFile, writeFile } from 'fs';
import readline from 'readline';
import { join } from 'path';
import mongoose from 'mongoose';

// Prepare dotenv config
import dotenv from 'dotenv';
dotenv.config();
const { TOKEN, MONGODB } = process.env;

// appending to the client
client.commands = new Collection();
client.Database = import('./db/Mongo.js');

// main init function
async function init() {
    // load events
    const eventFiles = readdirSync('./events').filter((file) => file.endsWith('.js'));
    for (const file of eventFiles) {
        const { default: event } = await import(`./events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }

    // grab command categories
    const commandFolders = readdirSync('./cmds')
        .filter((file) => statSync(join('./cmds', file)).isDirectory())
        .filter((file) => !file.startsWith('_'));

    // load commands
    for (const folder of commandFolders) {
        const commandFiles = readdirSync(`./cmds/${folder}`)
            .filter((file) => file.endsWith('.js'))
            .filter((file) => !file.startsWith('_'));
        for (const file of commandFiles) {
            const { default: command } = await import(`./cmds/${folder}/${file}`);
            if (command.userPermissions || command.requires) command.defaultPermissions = false;
            else command.defaultPermissions = true;
            client.commands.set(command.data.name, command);
        }
    }

    // connect to database
    await mongoose
        .connect(MONGODB)
        .then(() => {
            console.log('Connected to database');
        })
        .catch((err) => {
            console.log(`Unable to connect to MongoDB Database.\nError: ${err}`);
        });

    // login
    await client.login(TOKEN);
}

init();
