// This is the universal functions file.
// Use this to store functions you will be using across a bunch of commands.
// Will be easier for you to manage.
import Discord from 'discord.js';
import { exec } from 'child_process';
import { readFile, writeFile, unlinkSync } from 'fs';
import req from 'petitio';

/**
 * Builds a help RichEmbed based on the command information.
 * @param {Client} client The Discord Bot.
 * @param {Object} message The message object.
 * @param {String} command The command name.
 * @returns {Discord.MessageEmbed} The help embed information.
 */
export function helpMenuBuilder(client, message, command) {
    if (client.commands.has(command)) {
        command = client.commands.get(command);
    } else if (client.aliases.has(command)) {
        command = client.commands.get(client.aliases.get(command));
    } else {
        return;
    }

    const userperms = command.help.userPermissions.join(', ') || '-';
    const botperms = command.help.botPermission.join(', ') || '-';
    const aliases = command.help.alias.join(', ') || '-';
    const cmdusage = command.help.usage.join('\n');
    const examples = command.help.example.join('\n') || '-';

    const helpEmbed = new Discord.MessageEmbed()
        .setAuthor(command.help.cmdName, client.user.avatarURL)
        .setColor('RANDOM')
        .setDescription(command.help.description)
        .setFooter('<> is required, [] is optional.')
        .addField(`User Permissions`, '```css\n' + userperms + '```', true)
        .addField(`Bot Permissions`, '```css\n' + botperms + '```', true)
        .addField(`Arguments Required`, '```css\n' + command.help.argsLength + '```', true)
        .addField(`Aliases`, '```css\n' + aliases + '```', true)
        .addField(`Command Usage`, '```css\n' + cmdusage + '```')
        .addField(`Examples`, '```css\n' + examples + '```')
        .setTimestamp();

    return helpEmbed;
}

/**
 * Sends a message using the bot's default embed.
 * @param {Message} message the Message object.
 * @param {String} title the title of the embed.
 * @param {String} desc the embed description.
 */
export function msgAlert(message, title, desc) {
    const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setTitle(title)
        .setTimestamp()
        .setDescription(desc)
        .setColor('RANDOM');
    return message.channel.send(embed).then((msg) => msg.delete(5000));
}

/**
 * Returns a random element from an array.
 * @param {any[]} arr Array of elements.
 * @returns {any} An element of that array.
 *
 * @example randArr([1, 2, 3, 4, 5, 6, 7, 8]); // Returns (example): 5
 */
export function randArr(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Returns a random integer, inclusively.
 * @param {Number} min the minimum value.
 * @param {Number} max The maximum value.
 * @returns {Number} The random integer.
 *
 * @example randomInt(1, 5); // Returns (example): 4
 */
export function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Performs a bot restart.
 * @param interaction The initial bot interaction.
 * @param {String} oldChannelId The ID of the channel the command was used in.
 */
export async function doRestart(interaction, oldChannelId) {
    await interaction.update({ content: `**Restart confirmed by ${interaction.user}.** Restarting...`, components: [] });

    interaction.client.user.setStatus('dnd');

    await interaction.editReply({ content: `Successfully shut down by ${interaction.user}. Restarting...` });

    interaction.client.user.setStatus('invisible');

    writeFile(
        './rebootinfo',
        `${Date.now()}\n${oldChannelId.toString()}\nthiscomesfromarestartsoremovethemessageidcontainedaboveinthecurrentchannel`,
        (err?: any, result?: any) => {
            if (err) console.log('error', err);
            if (result) console.log(result);
        }
    );

    exec(`pm2 restart cardboardbox`, (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        if (err) {
            console.log(err);
            return interaction.channel.send('Something went wrong. Check the logs for details.');
        }
    });
}

/**
 * Exports data to Hastebin.
 * @param {Any} data Input data.
 * @param {String} ext The syntax highlighting to be used in the file.
 *
 * @returns {String} The Hastebin URL.
 */
export async function bin(data, ext = 'js') {
    data = JSON.stringify(data, null, 4);
    const res = await req('https://hst.sh/documents', 'POST').body({ content: data }).json();

    return `https://hst.sh/${res.key}.${ext}`;
}

export async function arrayExists(array, item) {
    if (array.indexOf(item) > -1) return true;

    return false;
}
