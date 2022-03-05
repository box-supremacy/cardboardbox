const Discord = require("discord.js");

module.exports.run = async (client, config, msg, args, functions) => {
    try {
        const message = await msg.channel.send("Ping?");
        message.edit(`${msg.author} Pong! Latency is ${message.createdTimestamp - msg.createdTimestamp}ms.`);
    }
    catch (e) {
        console.log(e);
    }
}

module.exports.help = {
    name: "ping",
    cmdName: "Bot Ping",
    alias: [],
    description: "Checks the bot's server response time.",
    ownerOnly: true,
    botPermission: [],
    userPermissions: [],
    argsLength: 0,
    usage: ["ping"],
    example: [ "ping" ]
}
