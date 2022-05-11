import fs from 'fs'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'

// Prepare dotenv config
import dotenv from 'dotenv'
dotenv.config()
const { TOKEN, CLIENTID } = process.env
const args = process.argv.slice(2);
const FORCEUPDATE = Boolean(args[0])

// Set up commands
const commands = []
const commandFolders = await fs
    .readdirSync('./cmds')
    .filter((folder) => !folder.startsWith('.'))
    .filter((folder) => !folder.startsWith('_'))
    .filter((folder) => !folder.startsWith('Secret'))

for (const folder of commandFolders) {
    const commandFiles = await fs
        .readdirSync(`./cmds/${folder}`)
        .filter((file) => file.endsWith('.js'))
        .filter((file) => !file.startsWith('_'))
    for (const file of commandFiles) {
        const { default: command } = await import(`./cmds/${folder}/${file}`);
        commands.push(command.data.toJSON())
    }
}

const rest = new REST({ version: '9' }).setToken(TOKEN)
let currentCmds: any = await rest.get(Routes.applicationCommands(CLIENTID))
// remove id, application_id, version, type, default_permission, default_member_permissions, and dm_permission from currentCmds
currentCmds = currentCmds.map((cmd) => {
    delete cmd.id
    delete cmd.application_id
    delete cmd.version
    delete cmd.type
    delete cmd.default_permission
    delete cmd.default_member_permissions
    delete cmd.dm_permission
    return cmd
})

const newCmds = commands.map((cmd) => {
    delete cmd.default_permission
    return cmd
});

const updateCommands = async () => {
    const updatedCmds = newCmds.filter((cmd) => !currentCmds.find((c) => c.name === cmd.name))
    const removedCmds = currentCmds.filter((cmd) => !newCmds.find((c) => c.name === cmd.name))

    if (updatedCmds.length > 0 || removedCmds.length > 0 || FORCEUPDATE) {
        rest.put(Routes.applicationCommands(CLIENTID), { body: commands })
        .then(async () => {
            console.log('Commands updated!')
        })
        .catch((err) => {
            console.error(err)
        })
    }
}

updateCommands()
