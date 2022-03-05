const Discord = require("discord.js");

module.exports.run = async (client, config, message, args, functions) => {
	try {
		const code = args.join(" ");
		let evaled = eval(code);

		if (typeof evaled !== "string")
			evaled = require("util").inspect(evaled);

		message.channel.send(clean(evaled), {code:"xl"});
	} catch (err) {
		message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
	}
}

module.exports.help = {
	name: "eval",
	cmdName: "Eval",
	alias: [],
	description: "Execute NodeJS commands.",
	ownerOnly: true,
	botPermission: [],
	userPermissions: [],
	argsLength: 1,
	usage: ["eval <commands here>"],
	example: ["eval console.log('Hello world!');"]
}

function clean(text) {
	if (typeof(text) === "string")
		return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
	else
		return text;
}
