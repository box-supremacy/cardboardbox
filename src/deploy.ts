import fs from 'fs'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'

// Prepare dotenv config
import dotenv from 'dotenv'
dotenv.config()
const { TOKEN, CLIENTID } = process.env

// Set up commands
const commands = []
const commandFolders = await fs
    .readdirSync('./cmds')
    .filter((folder) => !folder.startsWith('.'))
    .filter((folder) => !folder.startsWith('_'))

for (const folder of commandFolders) {
    const commandFiles = await fs
        .readdirSync(`./cmds/${folder}`)
        .filter((file) => file.endsWith('.js'))
        .filter((file) => !file.startsWith('_'))
    for (const file of commandFiles) {
        const { default: command } = await import(`./cmds/${folder}/${file}`)
        commands.push(command.data.toJSON())
    }
}

const rest = new REST({ version: '9' }).setToken(TOKEN)

rest.put(Routes.applicationCommands(CLIENTID), { body: commands })
    .then(async () => {
        console.log('Commands updated!')
    })
    .catch((err) => {
        console.error(err)
    })
