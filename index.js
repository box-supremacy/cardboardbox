const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config/config.json");
const { exec } = require("child_process");

const fs = require("fs");
const path = require('path');

checkUpdates();

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

client.login(config.token);

let modules = fs.readdirSync('./commands/').filter(file => fs.statSync(path.join('./commands/', file)).isDirectory());
for (let module of modules) {
    console.log(`============[FOLDER Set: ${module}]============`);

    let commandFiles = fs.readdirSync(path.resolve(`./commands/${module}`)).
    filter(file => !fs.statSync(path.resolve('./commands/', module, file)).isDirectory()).
    filter(file => file.endsWith('.js'));

    commandFiles.forEach((f, i) => {
        let props = require(`./commands/${module}/${f}`);
        console.log(`Loaded: ${f} (${i + 1})`);

        client.commands.set(props.help.name, props);
        props.help.alias.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
}

fs.readdir("./events/", (err, files) => {
    if (err) console.log(err);
    files.forEach(file => {
        let eventFunc = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, (...args) => eventFunc.run(client, ...args));
    });
});

process.on("uncaughtException", (error) => {
    console.error(error);
});

process.on("unhandledRejection", (error) => {
    console.error(error);
});

function checkUpdates() {
    console.log("Checking for updates...");
    exec('./autopull.sh',function(err, data) {
        console.log(data);
    })
    setTimeout(checkUpdates,60*1000);
};
