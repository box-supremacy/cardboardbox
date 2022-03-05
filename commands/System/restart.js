const Discord = require("discord.js");
const { exec } = require("child_process");

module.exports.run = async (client, config, msg, args, functions) => {
    try {
        client.user.setStatus("idle");

        let response = await client.awaitReply(msg, "**Are you sure you want to restart me?** Respond with \`yes\` to proceed.");
        msg.author.lastMessage.delete();
        let message = client.user.lastMessage;

        switch(response) {
            case "yes":
                await message.edit(`**Restart confirmed by ${msg.author}.** Restarting...`);

                client.user.setStatus("dnd");

                await message.edit(`Successfully shut down by ${msg.author}. Restarting...`);

                client.user.setStatus("invisible");
                let pid = process.pid;
                exec(`./restartbot.sh ${pid}`,function(err, data) {
                    console.log(data);
                })
                break;
            case "no":
                await message.edit(`**Restart cancelled by ${msg.author}.** This message will be removed in 5 seconds.`).then(message => {
                    message.delete({timeout: 5000}).catch(console.log);
                });
                client.user.setStatus("online");
                break;
            default:
                await message.edit(`**${msg.author}\'s response invalid**; restart aborted. This message will be removed in 5 seconds.`).then(message => {
                    message.delete({timeout: 5000}).catch(console.log);
                });
                client.user.setStatus("online");
        }
    }
    catch (e) {
        console.log(e);
    }
}

module.exports.help = {
    name: "restartbot",
    cmdName: "Restart bot",
    alias: [],
    description: "Restarts the bot.",
    ownerOnly: true,
    botPermission: [],
    userPermissions: [],
    argsLength: 0,
    usage: ["restartbot"],
    example: [ "restartbot" ]
}
