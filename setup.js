const inquirer = require("inquirer");
const Enmap = require("enmap");
const fs = require("fs");
const { exec } = require("child_process");

let baseConfig = fs.readFileSync("./config/base.json", "utf8");

let prompts = [
    {
        type: "input",
        name: "token",
        message: "Please enter your bot token from its application page."
    },
    {
        type: "input",
        name: "ownerID",
        message: "Please enter the bot owner's user ID."
    },
    {
        type: "input",
        name: "prefix",
        message: "What prefix would you like? (Default: /)"
    },
];

let startPrompt = [
    {
        type: "list",
        name: "runBot",
        message: "Configuration has been written. Do you want to start the bot?",
        choices: ["Yes", "No"]
    },
];

(async function() {
    console.log("Initializing bot config...");
    const answers = await inquirer.prompt(prompts);

    baseConfig = baseConfig
        .replace("{{ownerID}}", answers.ownerID)
        .replace("{{token}}", answers.token)
        .replace("{{prefix}}", answers.prefix ? answers.prefix : '/');

    fs.writeFileSync("./config/config.json", baseConfig);
    console.log("REMEMBER TO NEVER SHARE YOUR TOKEN WITH ANYONE!");

    const response = await inquirer.prompt(startPrompt);
    if(response.runBot && response.runBot === "Yes") {
        console.log("Starting bot. Have fun!");
        exec("node index.ts", (stdout, stderr, error) => {
            console.log(stdout);
        });
    }
}());
