import inquirer from 'inquirer';
import fs from 'fs';
import { exec } from 'child_process';

let prompts = [
    {
        type: 'password',
        name: 'token',
        mask: '*',
        message: 'Please enter your bot token from its application page.',
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
];

let startPrompt = [
    {
        type: 'list',
        name: 'runBot',
        message: 'Configuration has been written. Do you want to start the bot?',
        choices: ['Yes', 'No'],
    },
];

(async function () {
    console.log('Initializing bot config...');
    const answers = await inquirer.prompt(prompts);

    fs.writeFileSync('./.env', `TOKEN=${answers.token}\nOWNERID=${answers.ownerID}\nCLIENTID=${answers.clientID}`);
    console.log('REMEMBER TO NEVER SHARE YOUR TOKEN WITH ANYONE!');

    const response = await inquirer.prompt(startPrompt);
    if (response.runBot && response.runBot === 'Yes') {
        console.log('Starting bot. Have fun!');
        exec('pm2 start index.js', (stdout, stderr, error) => {
            console.log(stdout);
        });
    } else {
        console.log('Bot is ready to go. Simply run node index.js to start it.');
    }
})();
