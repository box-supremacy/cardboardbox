import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from '@discordjs/builders';
import fs from 'fs';
import path from 'path';

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get a list of all bot commands.')
        .addStringOption((opt) => opt.setName('command').setDescription('Command to view info for. Optional.').setRequired(false))
        .addStringOption((opt) => opt.setName('subcommand').setDescription('Subcommand of the command. Optional.').setRequired(false)),
    async execute(interaction) {
        const embed = {
            title: 'Commands',
            description: '',
            fields: [],
        };

        const command = interaction.options.get('command') || false;
        const subcommand = interaction.options.get('subcommand') || false;

        const commandIsSecret =
            command && interaction.client.commands.get(command.value).data.secret != null
                ? interaction.client.commands.get(command.value).data.secret
                : false;

        if (commandIsSecret) return interaction.editReply(`Command **/${command.value}** not found.`);

        if (subcommand && command) {
            let subcmd = interaction.client.commands.get(command.value).data.options || false;
            subcmd = subcmd.filter((obj) => obj.name == subcommand.value);
            subcmd = subcmd[0];

            if (!subcmd) return interaction.editReply(`**/${command.value}** has no subcommand \`${subcommand.value}\`.`);

            embed.title = `/${command.value} ${subcmd.name}`;
            embed.description = subcmd.description;
            if (subcmd.options.length > 0) {
                const subcmdOpts = subcmd.options.map((opt) => `**${opt.name}**${opt.required ? ` *(required)*` : ''} — ${opt.description}`).join('\n');

                embed.fields = [
                    {
                        name: 'Fields',
                        value: subcmdOpts,
                        inline: true,
                    },
                ];
            }

            return interaction.editReply({ embeds: [embed] });
        }

        if (command) {
            let cmd = interaction.client.commands.get(command.value) || false;
            cmd = cmd.data;

            if (!cmd) return interaction.editReply(`Command **/${command.value}** not found.`);

            embed.title = `/${cmd.name}`;
            embed.description = cmd.description;
            if (cmd.options.length > 0) {
                const cmdOpts = cmd.options.map((opt) => `**${opt.name}**${opt.required ? ` *(required)*` : ''} — ${opt.description}`).join('\n'),
                    optTypes = cmd.options.map((opt) => ('required' in opt ? 'Fields' : 'Subcommands'));

                embed.fields = [
                    {
                        name: optTypes.indexOf('Subcommands') > -1 ? 'Subcommands' : 'Fields',
                        value: cmdOpts,
                        inline: true,
                    },
                ];
            }

            return interaction.editReply({ embeds: [embed] });
        }

        const commandFolders = fs
            .readdirSync('./cmds')
            .filter((file) => fs.statSync(path.join('./cmds', file)).isDirectory())
            .filter((file) => !file.startsWith('_'))
            .filter((file) => !file.startsWith('Secret'));
        commandFolders.forEach((folder) => {
            embed.fields.push({
                name: folder,
                value: '',
                inline: true,
            });
        });

        // load commands
        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`./cmds/${folder}`)
                .filter((file) => file.endsWith('.js'))
                .filter((file) => !file.startsWith('_'));

            commandFiles.forEach((file) => {
                embed.fields[commandFolders.indexOf(folder)].value += `${file.slice(0, -3)}\n`;
            });
        }

        interaction.editReply({ embeds: [embed] });
    },
};
