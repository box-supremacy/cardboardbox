const { RichEmbed } = require('discord.js');

exports.run = (client, message, args, level) => {
    message.delete();
    if (!args[0]) {
        const myCommands = message.guild
            ? client.commands.filter((cmd) => client.levelCache[cmd.conf.permLevel] <= level)
            : client.commands.filter((cmd) => client.levelCache[cmd.conf.permLevel] <= level && cmd.conf.guildOnly !== true);

        const commandNames = myCommands.keyArray();
        const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

        let currentCategory = '';
        let output = `= Command List =\n\n[Use ${message.settings.prefix}help <commandname> for details]\n`;
        const sorted = myCommands
            .array()
            .sort((p, c) => (p.help.category > c.help.category ? 1 : p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1));
        sorted.forEach((c) => {
            const cat = c.help.category.toProperCase();
            if (currentCategory !== cat) {
                output += `\u200b\n== ${cat} ==\n`;
                currentCategory = cat;
            }
            output += `${message.settings.prefix}${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
        });
        return message.channel.send(output, { code: 'asciidoc', split: { char: '\u200b' } });
    }
    let command = args[0];
    if (!client.commands.has(command)) return;
    command = client.commands.get(command);
    if (level < client.levelCache[command.conf.permLevel]) return;
    message.channel.send({
        embeds: [
            client.embed(
                `Command information: "${command.help.name}"`,
                command.help.description,
                [
                    {
                        name: 'Category',
                        value: command.help.category !== '' ? command.help.category : 'none',
                        inline: true,
                    },
                    {
                        name: 'Usage',
                        value: command.help.usage,
                        inline: true,
                    },
                    {
                        name: 'Aliases',
                        value: command.conf.aliases.join(', ') !== '' ? command.conf.aliases.join(', ') : 'none',
                        inline: true,
                    },
                ],
                {
                    author: message.author.tag,
                    authorIcon: message.author.avatarURL,
                }
            ),
        ],
    });
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['h', 'halp'],
    permLevel: 'User',
};

exports.help = {
    name: 'help',
    category: 'Information',
    description: 'Displays all the available commands for your permission level.',
    usage: 'help [command]',
};
