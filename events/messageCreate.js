module.exports = async (client, message) => {
    if (message.author.bot) return;
    const settings = (message.settings = client.getSettings(message.guild));

    const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(prefixMention)) {
        return message.reply(`my prefix for this guild is \`${settings.prefix}\`.`);
    }

    if (message.content.indexOf(settings.prefix) !== 0) return;

    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (message.guild && !message.member) await message.guild.fetchMember(message.author);

    const level = client.permlevel(message);

    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (!cmd) return;

    if (cmd && !message.guild && cmd.conf.guildOnly)
        return message.channel.send('This command is unavailable via private message. Please run this command in a guild.');

    if (level < client.levelCache[cmd.conf.permLevel]) {
        if (settings.systemNotice === 'true') {
            message.delete();
            return message.channel.send({
                embed: client.embed(
                    '**Invalid permissions!**',
                    `You don't have the proper user level to use command ${cmd.help.name}.`,
                    [
                        {
                            name: '**__Required permissions level:__**',
                            value: `**${client.levelCache[cmd.conf.permLevel]}** (${cmd.conf.permLevel})`,
                        },
                        {
                            name: '**__Your permissions level:__**',
                            value: `**${level}** (${client.config.permLevels.find((l) => l.level === level).name})`,
                        },
                    ],
                    {
                        author: message.author.tag,
                        authorIcon: message.author.avatarURL,
                    }
                ),
            });
        } else {
            return;
        }
    }

    message.author.permLevel = level;

    message.flags = [];
    while (args[0] && args[0][0] === '-') {
        message.flags.push(args.shift().slice(1));
    }

    client.logger.cmd(
        `[CMD] ${client.config.permLevels.find((l) => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`
    );
    cmd.run(client, message, args, level);
};
