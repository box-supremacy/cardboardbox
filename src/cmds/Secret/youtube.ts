import { createWriteStream, unlink } from 'fs';
import ytdl from 'ytdl-core';
import { MessageAttachment } from 'discord.js';

export default {
    data: {
        name: 'youtube',
        description: 'Download YouTube video.',
        secret: true,
    },
    async execute(message, args) {
        message.delete();

        // download youtube video from args[0] and send a discord.js v13 message with the file as an attachment
        const stream = ytdl(args[0], { filter: 'audioonly' });
        const file = createWriteStream(`${message.author.id}.mp3`);
        stream.pipe(file);
        file.on('finish', async () => {
            file.close();
            const attachment = new MessageAttachment(`./${message.author.id}.mp3`);
            await message.channel.send(`${message.author.username}'s video has been downloaded!`, {
                files: ['attachment'],
            });
            stream.destroy();
            unlink(`${message.author.id}.mp3`, () => {});
        });
    },
};
