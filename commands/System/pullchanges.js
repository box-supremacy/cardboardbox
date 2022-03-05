const Discord = require("discord.js");
const { exec } = require("child_process");

module.exports.run = async (client, config, message, args, functions) => {
	exec(`./autopull.sh`,function(err, data) {
		message.channel.send(data);
	})
}

module.exports.help = {
    name: "pullchanges",
    cmdName: "Pull Bot Changes",
    alias: ["pull"],
    description: "Attempts to pull changes from the bot's Git repo, and prompts the user to restart the bot if changes are found.",
    ownerOnly: true,
    botPermission: [],
    userPermissions: [],
    argsLength: 0,
    usage: ["pullchanges"],
    example: ["pullchanges"]
}
