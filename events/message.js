const config = require("../config/config.json");

const {
    msgAlert,
    helpMenuBuilder
} = require("../utility/functions.js")

module.exports.run = async (client, msg) => {
    if (msg.author.bot) return;
    if (!msg.guild) return;
    let prefix = config.prefix;

    if (msg.content.indexOf(prefix) != 0) return;

    let msgArray = msg.content.split(" ");
    let cmd = msgArray[0];
    let args = msgArray.slice(1);
    let commandfile = cmd.slice(prefix.length);

    let execCMD;
    if (client.commands.has(commandfile)) {
        execCMD = client.commands.get(commandfile);
    } else if (client.aliases.has(commandfile)) {
        execCMD = client.commands.get(client.aliases.get(commandfile));
    }

    if (execCMD) {
        msg.delete().catch(error => {});

        if (execCMD.help.ownerOnly) {
            let app = await msg.client.fetchApplication();
            let owner = await msg.client.users.fetch(app.owner.id);

            if (owner.id !== msg.author.id) {
                return msgAlert(msg, "Denied", "You are not the bot's owner.");
            }
        }

        if (execCMD.help.userPermissions) {
            if (!msg.channel.permissionsFor(msg.member) || !msg.channel.permissionsFor(msg.member).has(execCMD.help.userPermissions)) {
                return msgAlert(msg, "Denied", "You do not have the permissions needed to run this command.");
            }
        }

        if (execCMD.help.botPermission) {
            if (!msg.channel.permissionsFor(msg.guild.me) || !msg.channel.permissionsFor(msg.guild.me).has(execCMD.help.botPermission)) {
                return msgAlert(msg, "Denied", "I cannot run the command due to limited permissions.");
            }
        }

        if (args.length < execCMD.help.argsLength) {
            command = commandfile;
            return msg.channel.send(helpMenuBuilder(client, msg, commandfile));
        }

        const functions = require("../utility/functions.js");
        return execCMD.run(client, config, msg, args, functions);
    }
}
