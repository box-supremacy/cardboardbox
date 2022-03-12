const got = require('got');

exports.run = async (client, message, args, level) => {
    const pgAmount = args[0] || 2;
    const out = await got(`https://loripsum.net/api/${pgAmount}/decorate/code`);

    let final = out.body;
    final = final
        .replace('<b>', '**')
        .replace('</b>', '**')
        .replace('<p>', '')
        .replace(' </p>', '')
        .replace('<i>', '_')
        .replace('</i>', '_')
        .replace('<mark>', '||')
        .replace('</mark>', '||')
        .replace('<pre>', '```')
        .replace('</pre>', '```');

    message.channel.send(final);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 'Bot Owner',
};

exports.help = {
    name: 'test',
    category: '',
    description: 'Sends randomly-generated Lorem Ipsum demo text.',
    usage: 'test [paragraphCount:2]',
};
