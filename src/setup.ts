import inquirer from 'inquirer'
import fs from 'fs'
import { spawn } from 'child_process'
import { walkForFiles } from './util.js'

const importPreviousConfigs = async () => {
    const envFound = !process.cwd().includes('/src/') ? walkForFiles('./src/', '.env') : walkForFiles('./', '.env')
    const envOutDir = !process.cwd().includes('/dist/') ? './dist/.env' : './.env'
    const res = await inquirer.prompt({
        type: 'confirm',
        name: 'usePreviousConfig',
        message: 'A .env file already exists. Do you want to use it?',
    })

    if (res.usePreviousConfig) {
        fs.copyFile(envFound[0], envOutDir, (err) => {
            if (err) {
                console.log(err)
                return
            }
        })
    }
}

const setupConfig = async () => {
    console.log('Initializing bot config...')
    const answers = await inquirer.prompt(prompts)
    if (answers.mongoDefault != 1) {
        const mongoPath = await inquirer.prompt({
            type: 'input',
            name: 'mongoAddress',
            message: 'Please enter the address of your MongoDB database.',
        })
        return {
            ...mongoPath,
            mongoDefault: false,
        }
    }

    const { token, prefix, ownerID, clientID, mongoDefault, mongoAddress } = answers

    fs.writeFileSync(
        './.env',
        `TOKEN=${token}\nOWNERID=${ownerID}\nCLIENTID=${clientID}\nMONGODB=${
            mongoDefault ? 'mongodb://localhost:27017/cardboardbox' : mongoAddress
        }\nBOT_PREFIX=${prefix}`
    )
    console.log('REMEMBER TO NEVER SHARE YOUR TOKEN WITH ANYONE!')
}

const initiateBot = async () => {
    const yarn = spawn('yarn', ['start'], { shell: true })
    yarn.stdout.on('data', (data) => {
        console.log(data.toString())
    })

    yarn.stderr.on('data', (data) => {
        console.error(data.toString())
    })

    yarn.on('close', (code) => {
        console.log(`child_process.spawn: exited with code ${code}`)
    })
}

const runBot = async () => {
    const response = await inquirer.prompt({
        type: 'list',
        name: 'runBot',
        message: 'Configuration has been written. Do you want to start the bot?',
        choices: ['Yes', 'No'],
    })
    if (response.runBot && response.runBot === 'Yes') {
        console.log('Starting bot. Have fun!')
        initiateBot()
    } else {
        console.log('Bot is ready to go. Simply run node index.js to start it.')
    }
}

let prompts = [
    {
        type: 'password',
        name: 'token',
        mask: '*',
        message: 'Please enter your bot token from its application page.',
    },
    {
        type: 'input',
        name: 'prefix',
        message: 'Please enter the prefix for the bot.',
    },
    {
        type: 'input',
        name: 'ownerID',
        message: 'Please enter your user ID. The user with that ID will be marked as the bot owner.',
    },
    {
        type: 'input',
        name: 'clientID',
        message: "Please enter your bot's client ID from its application page.",
    },
    {
        type: 'confirm',
        name: 'mongoDefault',
        message: 'Are you hosting your MongoDB database through MONGODB=mongodb://localhost:27017/cardboardbox?',
        default: 1,
    },
]

;(async () => {
    const envFound = !process.cwd().includes('/src/') ? walkForFiles('./src/', '.env') : walkForFiles('./', '.env')
    if (envFound.length > 0) {
        await importPreviousConfigs()
    } else {
        await setupConfig()
    }
    await runBot()
})()
