const { MessageEmbed } = require('discord.js');
const got = require('got');
const fetch = require('node-fetch');

module.exports = (client) => {
    client.permlevel = (message) => {
        let permlvl = 0;

        const permOrder = client.config.permLevels.slice(0).sort((p, c) => (p.level < c.level ? 1 : -1));

        while (permOrder.length) {
            const currentLevel = permOrder.shift();
            if (message.guild && currentLevel.guildOnly) continue;
            if (currentLevel.check(message)) {
                permlvl = currentLevel.level;
                break;
            }
        }
        return permlvl;
    };

    const defaultSettings = {
        prefix: 'b&',
        modLogChannel: 'mod-log',
        modRole: 'modinator',
        adminRole: 'adminator',
        systemNotice: 'true',
        welcomeChannel: 'welcome',
        welcomeMessage: 'Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D',
        welcomeEnabled: 'false',
    };

    client.getSettings = (guild) => {
        client.settings.ensure('default', defaultSettings);
        if (!guild) return client.settings.get('default');
        const guildConf = client.settings.get(guild.id) || {};
        return { ...client.settings.get('default'), ...guildConf };
    };

    client.awaitReply = async (msg, question, limit = 60000) => {
        const filter = (m) => m.author.id === msg.author.id;
        await msg.channel.send(question);
        try {
            const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ['time'] });
            return collected.first().content;
        } catch (e) {
            return false;
        }
    };

    client.caseNumber = async (client, modlog) => {
        const messages = await modlog.fetchMessages({ limit: 5 });

        const log = messages
            .filter(
                (m) =>
                    m.author.id === client.user.id &&
                    m.embeds[0] &&
                    m.embeds[0].type === 'rich' &&
                    m.embeds[0].footer &&
                    m.embeds[0].footer.text.startsWith('Case')
            )
            .first();

        if (!log) return 1;
        const thisCase = /Case\s(\d+)/.exec(log.embeds[0].footer.text);
        return thisCase ? parseInt(thisCase[1]) + 1 : 1;
    };

    client.clean = async (client, text) => {
        if (text && text.constructor.name == 'Promise') text = await text;
        if (typeof text !== 'string') text = require('util').inspect(text, { depth: 1 });

        text = text
            .replace(/`/g, '`' + String.fromCharCode(8203))
            .replace(/@/g, '@' + String.fromCharCode(8203))
            .replace(client.token, 'mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0');

        return text;
    };

    client.loadCommand = (commandName) => {
        try {
            client.logger.log(`Loading Command: ${commandName}`);
            const props = require(`../${commandName}`);
            if (props.init) {
                props.init(client);
            }
            client.commands.set(props.help.name, props);
            props.conf.aliases.forEach((alias) => {
                client.aliases.set(alias, props.help.name);
            });
            return false;
        } catch (e) {
            return `Unable to load command ${commandName}: ${e}`;
        }
    };

    client.unloadCommand = async (commandName) => {
        let command;
        if (client.commands.has(commandName)) {
            command = client.commands.get(commandName);
        } else if (client.aliases.has(commandName)) {
            command = client.commands.get(client.aliases.get(commandName));
        }
        if (!command) return `The command \`${commandName}\` doesn\'t seem to exist, nor is it an alias. Try again!`;

        if (command.shutdown) {
            await command.shutdown(client);
        }
        const mod = require.cache[require.resolve(`../commands/${command.help.category}/${command.help.name}`)];
        delete require.cache[require.resolve(`../commands/${command.help.category}/${command.help.name}.js`)];
        for (let i = 0; i < mod.parent.children.length; i++) {
            if (mod.parent.children[i] === mod) {
                mod.parent.children.splice(i, 1);
                break;
            }
        }
        return false;
    };

    Object.defineProperty(String.prototype, 'toProperCase', {
        value: function () {
            return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        },
    });

    Object.defineProperty(Array.prototype, 'random', {
        value: function () {
            return this[Math.floor(Math.random() * this.length)];
        },
    });

    client.wait = require('util').promisify(setTimeout);

    client.randomSelection = (choices) => choices[Math.floor(Math.random() * choices.length)];

    process.on('uncaughtException', (err) => {
        const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
        client.logger.error(`Uncaught Exception: ${errorMsg}`);
        console.error(err);
        process.exit(1);
    });

    process.on('unhandledRejection', (err) => {
        client.logger.error(`Unhandled rejection: ${err}`);
        console.error(err);
    });

    client.parseArgs = (args, options) => {
        if (!options) return args;
        if (typeof options === 'string') options = [options];

        let optionValues = {};

        let i;
        for (i = 0; i < args.length; i++) {
            let arg = args[i];
            if (!arg.startsWith('-')) {
                break;
            }

            let label = arg.substr(1);

            if (options.indexOf(label + ':') > -1) {
                let leftover = args.slice(i + 1).join(' ');
                let matches = leftover.match(/^"(.+?)"/);
                if (matches) {
                    optionValues[label] = matches[1];
                    i += matches[0].split(' ').length;
                } else {
                    i++;
                    optionValues[label] = args[i];
                }
            } else if (options.indexOf(label) > -1) {
                optionValues[label] = true;
            } else {
                break;
            }
        }

        return {
            options: optionValues,
            leftover: args.slice(i),
        };
    };

    client.embed = (title, description = '', fields = [], options = {}) => {
        let url = options.url || '';
        let color = options.color || randomColor();

        if (options.inline) {
            if (fields.length % 3 === 2) {
                fields.push({ name: '\u200b', value: '\u200b' });
            }
            fields.forEach((obj) => {
                obj.inline = true;
            });
        }

        return new MessageEmbed({ fields, video: options.video || url })
            .setTitle(title)
            .setColor(color)
            .setDescription(description)
            .setURL(url)
            .setImage(options.image)
            .setTimestamp(options.timestamp ? timestampToDate(options.timestamp) : null)
            .setFooter({
                text: options.footer === true ? randomFooter() : options.footer ? options.footer : '',
                iconURL: options.footerIcon === true ? options.footerIcon : client.user.avatarURL,
            })
            .setThumbnail(options.thumbnail);
    };

    const randomColor = () => [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];

    const randomFooter = () => {
        return randomSelection([
            'just add water!',
            'Powered by squirrels!',
            'codeisluvcodeislife',
            'Where did you get that?',
            'WHAT DID YOU BREAK!?',
            'D-D-D-DROP THE BASS',
            'Eat, Sleep, JavaScript',
            '#BlameRhearmas',
            'SharpBot was the best, right?',
            'I like turtles',
            'Hi mom!',
        ]);
    };

    const timestampToDate = (timestamp) => {
        if (timestamp === true) {
            return new Date();
        }
        if (typeof timestamp === 'number') {
            return new Date(timestamp);
        }
        return timestamp;
    };

    const parseArgs = (args, options) => {
        if (!options) return args;
        if (typeof options === 'string') options = [options];

        let optionValues = {};

        let i;
        for (i = 0; i < args.length; i++) {
            let arg = args[i];
            if (!arg.startsWith('-')) {
                break;
            }

            let label = arg.substr(1);

            if (options.indexOf(label + ':') > -1) {
                let leftover = args.slice(i + 1).join(' ');
                let matches = leftover.match(/^"(.+?)"/);
                if (matches) {
                    optionValues[label] = matches[1];
                    i += matches[0].split(' ').length;
                } else {
                    i++;
                    optionValues[label] = args[i];
                }
            } else if (options.indexOf(label) > -1) {
                optionValues[label] = true;
            } else {
                break;
            }
        }

        return {
            options: optionValues,
            leftover: args.slice(i),
        };
    };

    const multiSend = (channel, messages, delay) => {
        delay = delay || 100;
        messages.forEach((m, i) => {
            setTimeout(() => {
                channel.send(m);
            }, delay * i);
        });
    };

    client.textUpload = (text, options) => {
        options = options || {};
        let method = (options.method || uploadMethods.ix).toLowerCase();

        if (method === uploadMethods.ix) {
            return ixUpload(text);
        } else if (method === uploadMethods.hastebin) {
            return hastebinUpload(text);
        }
    };

    const uploadMethods = {
        hastebin: 'hastebin',
        ix: 'ix.io',
    };

    const hastebinUpload = (text) => {
        return got('https://hastebin.com/documents', { body: { contents: text }, form: true }).then((res) => {
            if (res && res.body && res.body.key) {
                const key = res.body.key;
                return {
                    key: key,
                    success: true,
                    url: `https://hastebin.com/${key}`,
                    rawUrl: `https://hastebin.com/raw/${key}`,
                };
            } else {
                return {
                    success: false,
                };
            }
        });
    };

    const ixUpload = (text) => {
        return got('http://ix.io', { body: { 'f:1': text }, form: true }).then((res) => {
            if (res && res.body) {
                return {
                    success: true,
                    url: res.body,
                    rawUrl: res.body,
                };
            } else {
                return {
                    success: false,
                };
            }
        });
    };

    client.quoteRegex = (input) => `${input}`.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');

    client.fetchURL = (url, options = {}) => {
        options.headers = options.headers ? { ...options.headers, 'User-Agent': client.user } : { 'User-Agent': client.user };
        return fetch(url, options, options.type || 'json').catch((error) => {
            client.Logger.error(error);
        });
    };
};
