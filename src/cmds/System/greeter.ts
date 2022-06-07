import { SlashCommandBuilder } from '@discordjs/builders';
import * as db from '../../db/Mongo.js';

export default {
    data: new SlashCommandBuilder()
        .setName('greeter')
        .setDescription('Greeter config.')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('enabled')
                .setDescription('Choose whether the greeter is on or off.')
                .addBooleanOption((option) =>
                    option.setName('enabled').setDescription('New state of the greeter. Leave blank to view the current state.').setRequired(false)
                )
        )

        .addSubcommand((subcommand) =>
            subcommand
                .setName('channel')
                .setDescription('Set the channel for the greeter.')
                .addChannelOption((arg) => {
                    return arg
                        .setName('channel')
                        .setDescription('The channel to assign it to. Leave blank to get the current channel.')
                        .setRequired(false);
                })
        )

        .addSubcommandGroup((subcommandGroup) =>
            subcommandGroup
                .setName('messages')
                .setDescription('Set the join and leave messages. Leave any subcommand blank to get its current value.')
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('join')
                        .setDescription('Modify join messages.')
                        .addStringOption((option) =>
                            option
                                .setName('action')
                                .setDescription('Action to take with the current messages.')
                                .addChoice('add', 'add')
                                .addChoice('remove', 'remove')
                                .addChoice('list', 'list')
                                .setRequired(true)
                        )
                        .addStringOption((option) => option.setName('message').setDescription('The new join message.').setRequired(false))
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('leave')
                        .setDescription('Modify leave messages.')
                        .addStringOption((option) =>
                            option
                                .setName('action')
                                .setDescription('Action to take with the current messages.')
                                .addChoice('add', 'add')
                                .addChoice('remove', 'remove')
                                .addChoice('list', 'list')
                                .setRequired(true)
                        )
                        .addStringOption((option) => option.setName('message').setDescription('The new leave message.').setRequired(false))
                )
        )

        .addSubcommandGroup((subcommandGroup) =>
            subcommandGroup
                .setName('dm')
                .setDescription('Configure the DM message. Leave any subcommand blank to get its current value.')
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('dm_enabled')
                        .setDescription('Enable DM messages on join.')
                        .addBooleanOption((option) => option.setName('setting').setDescription('New setting.').setRequired(false))
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('message')
                        .setDescription('Modify DM message.')
                        .addStringOption((option) => option.setName('message').setDescription('The new DM message.').setRequired(false))
                )
        ),

    async execute(interaction) {
        const guild = await db.fetchGuild(interaction.guild.id);

        switch (await interaction.options.getSubcommand()) {
            case 'enabled':
                switch (await interaction.options.get('enabled').value) {
                    case true:
                        guild.addons.greeter.enabled = true;
                        await guild.save();
                        return interaction.editReply(':white_check_mark: Greeter is now enabled.');
                    case false:
                        guild.addons.greeter.enabled = false;
                        await guild.save();
                        return interaction.editReply(':white_check_mark: Greeter is now disabled.');
                    default:
                        return interaction.editReply(`Greeter is currently ${guild.addons.greeter.enabled ? 'enabled' : 'disabled'}.`);
                }
            case 'channel':
                const channelOpt = await interaction.options.get('channel');
                const channel = channelOpt != null ? await channelOpt.value : false;
                if (channel) {
                    const channelID = channel.match(/[0-9]+/g);
                    if (channelID) {
                        guild.addons.greeter.channel = channelID[0];
                        await guild.save();
                        return interaction.editReply(`:white_check_mark: Greeter channel set to <#${channelID[0]}>.`);
                    }
                    return interaction.editReply(`:x: Invalid channel ID.`);
                }
                return interaction.editReply(`Greeter channel is currently <#${guild.addons.greeter.channel}>.`);
            case 'join':
                switch (await interaction.options.get('action').value) {
                    case 'add':
                        guild.addons.greeter.joinMessages.push(await interaction.options.get('message').value);
                        await guild.save();
                        return interaction.editReply(`:white_check_mark: Added join message.`);
                    case 'remove':
                        const index = guild.addons.greeter.joinMessages.indexOf(await interaction.options.get('message').value);
                        if (index > -1) {
                            guild.addons.greeter.joinMessages.splice(index, 1);
                            await guild.save();
                            return interaction.editReply(`:white_check_mark: Removed join message.`);
                        }
                        return interaction.editReply(`:x: Could not find join message.`);
                    case 'list':
                        return interaction.editReply(`Join messages: ${'`' + guild.addons.greeter.joinMessages.join('`, `') + '`' || 'None'}.`);
                    default:
                        return interaction.editReply(`:x: Invalid action.`);
                }
            case 'leave':
                switch (await interaction.options.get('action').value) {
                    case 'add':
                        guild.addons.greeter.leaveMessages.push(await interaction.options.get('message').value);
                        await guild.save();
                        return interaction.editReply(`:white_check_mark: Added join message.`);
                    case 'remove':
                        const index = guild.addons.greeter.leaveMessages.indexOf(await interaction.options.get('message').value);
                        if (index > -1) {
                            guild.addons.greeter.leaveMessages.splice(index, 1);
                            await guild.save();
                            return interaction.editReply(`:white_check_mark: Removed join message.`);
                        }
                        return interaction.editReply(`:x: Could not find join message.`);
                    case 'list':
                        return interaction.editReply(`Leave messages: ${'`' + guild.addons.greeter.leaveMessages.join('`, `') + '`' || 'None'}.`);
                    default:
                        return interaction.editReply(`:x: Invalid action.`);
                }
            case 'dm_enabled':
                switch (await interaction.options.get('setting').value) {
                    case true:
                        guild.addons.greeter.dmGreet.enabled = true;
                        await guild.save();
                        return interaction.editReply(':white_check_mark: DM messages are now enabled.');
                    case false:
                        guild.addons.greeter.dmGreet.enabled = false;
                        await guild.save();
                        return interaction.editReply(':white_check_mark: DM messages are now disabled.');
                    default:
                        return interaction.editReply(`DM messages are currently ${guild.addons.greeter.dmGreet.enabled ? 'enabled' : 'disabled'}.`);
                }
            case 'message':
                const messageOpt = await interaction.options.get('message');
                const message = messageOpt != null ? await messageOpt.value : false;
                if (message) {
                    guild.addons.greeter.dmGreet.message = message;
                    await guild.save();
                    return interaction.editReply(`:white_check_mark: DM message set to ${message}.`);
                }
                return interaction.editReply(`DM message is currently ${guild.addons.greeter.dmGreet.message || 'None'}.`);
            default:
                return interaction.editReply(`:x: Invalid subcommand.`);
        }
    },
};
