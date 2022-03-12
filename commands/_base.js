/*
This file is ignored by the bot's command loader because of the underscore at the start of the file name. The purpose of this file is for developers to get a headstart on implementing their own commands.
Developers, remember to insert all three exports; these are required. Your command won't load if any of these are missing.
*/

exports.run = async (client, message, args, level) => {
    message.reply('Hello there!');
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 'User',
};

exports.help = {
    name: '',
    category: '',
    description: '',
    usage: '',
};

// Basic message auto-deletion
// if (!args[0]) {
//     message.delete();
//     return (await message.reply('text')).delete(5000).catch(() => {});
// }
