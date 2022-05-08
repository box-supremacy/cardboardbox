// This is the universal functions file.
// Use this to store functions you will be using across a bunch of commands.
// Will be easier for you to manage.
import { exec } from 'child_process'
import { writeFile, readdirSync, statSync } from 'fs'
import req from 'petitio'

/**
 * Sends a message using the bot's default embed.
 * @param {Message} message the Message object.
 * @param {String} title the title of the embed.
 * @param {String} desc the embed description.
 */
export function msgAlert(message, title, desc) {
    const embed = {
        author: { name: message.author.tag, icon_url: message.author.avatarURL },
        color: 'RANDOM',
        title: title,
        description: desc,
        timestamp: new Date().toLocaleString(),
    }

    return message.channel.send(embed).then((msg) => msg.delete(5000))
}

/**
 * Returns a random element from an array.
 * @param {any[]} arr Array of elements.
 * @returns {any} An element of that array.
 *
 * @example randArr([1, 2, 3, 4, 5, 6, 7, 8]); // Returns (example): 5
 */
export function randArr(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
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
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Performs a bot restart.
 * @param interaction The initial bot interaction.
 * @param {String} oldChannelId The ID of the channel the command was used in.
 */
export async function doRestart(message, oldChannelId) {
    await message.update({ content: `**Restart confirmed by ${message.user}.** Restarting...`, components: [] })
    message.client.user.setStatus('dnd')

    writeFile(
        './rebootinfo',
        `${Date.now()}\n${oldChannelId.toString()}\nthiscomesfromarestartsoremovethemessageidcontainedaboveinthecurrentchannel`,
        (err?: any, result?: any) => {
            if (err) console.log('error', err)
            if (result) console.log(result)
        }
    )

    await message.editReply({ content: `Successfully shut down by ${message.user}. Restarting...` })
    message.client.user.setStatus('invisible')

    exec(`yarn restart`, (err, stdout, stderr) => {
        console.log(stdout)
        console.log(stderr)
        if (err) {
            console.log(err)
            return message.channel.send('Something went wrong. Check the logs for details.')
        }
    })
}

/**
 * Exports data to Hastebin.
 * @param {Any} data Input data.
 * @param {String} ext The syntax highlighting to be used in the file.
 *
 * @returns {String} The Hastebin URL.
 */
export async function bin(data, ext = 'js') {
    data = JSON.stringify(data, null, 4)
    const res = await req('https://hst.sh/documents', 'POST').body({ content: data }).json()

    return `https://hst.sh/${res.key}.${ext}`
}

export async function arrayExists(array, item) {
    if (array.indexOf(item) > -1) return true

    return false
}

export const walkForFiles = (dir, target?) => {
    let results = []
    const list = readdirSync(dir)
    list.forEach((file) => {
        file = dir + '/' + file
        const stat = statSync(file)
        if (target && !file.includes(target)) return
        if (stat && stat.isDirectory()) {
            /* Recurse into a subdirectory */
            results = results.concat(walkForFiles(file, target))
        } else {
            /* Is a file */
            results.push(file)
        }
    })
    return results
}
