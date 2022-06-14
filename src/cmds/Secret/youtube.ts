import ytdl from 'ytdl-core';
import { MessageAttachment } from 'discord.js';
import path from 'path';
import fs from 'fs';

import AWS from 'aws-sdk';

var region = 'nyc3'; // New York region by default

var spacesEndpoint = new AWS.Endpoint(region + '.digitaloceanspaces.com');
var s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.SPACES_ACCESS_KEY,
    secretAccessKey: process.env.SPACES_SECRET_KEY,
});

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getTitleVideo(videoUrl) {
    ytdl.getInfo(videoUrl, (info) => {
        return info.videoDetails.title;
    });
}

export default {
    data: {
        name: 'youtube',
        description: 'Download YouTube video.',
        secret: true,
    },
    async execute(message, args) {
        message.delete();
        const msg = await message.channel.send(`Finding video from link <${args[0]}>...`);

        const stream = ytdl(args[0], { filter: 'audioonly' });
        stream.on('info', async (info) => {
            await msg.edit(`Found video **${info.videoDetails.title}** by **${info.videoDetails.author.name}**. Downloading as MP3...`);
        });

        let info = await ytdl.getInfo(args[0]);
        let title = info.videoDetails.title;
        title = title.replaceAll('/', ' and ');
        title = title.replaceAll(' ', '_');
        title = title.replaceAll(/\?|\!|\*|\<|\>|\\|\:|\||\.|\,|\s\(.*\)|\s\(.*\)\s|\(.*\)\s|\(.*\)/g, '');

        let file = fs.createWriteStream(`${title}.mp3`);
        stream.pipe(file);

        file.on('finish', async () => {
            await msg.edit('File downloaded. Uploading to *http://cdn.box.lol*...');
            file.close();
            var filePath = path.join(__dirname, `../../${title}.mp3`);
            var params = {
                Bucket: 'gmod-music-files',
                Key: path.basename(filePath),
                Body: fs.createReadStream(filePath),
                ACL: 'public-read',
            };

            var options = {
                partSize: 10 * 1024 * 1024, // 10 MB
                queueSize: 10,
            };

            await s3.upload(params, options, async function (err, data) {
                if (!err) {
                    await msg.edit({
                        content: `MP3 uploaded!`,
                        embeds: [
                            {
                                title: 'Upload info',
                                fields: [
                                    {
                                        name: 'Video Title',
                                        value: info.videoDetails.title,
                                        inline: true,
                                    },
                                    {
                                        name: 'Author',
                                        value: info.videoDetails.author.name,
                                        inline: true,
                                    },
                                    {
                                        name: 'CDN Link',
                                        value: data.Location.replace('nyc3.digitaloceanspaces.com/gmod-music-files', 'http://cdn.box.lol').replace(
                                            'https://gmod-music-files.nyc3.digitaloceanspaces.com',
                                            'http://cdn.box.lol'
                                        ),
                                    },
                                    {
                                        name: 'Original YouTube URL',
                                        value: args[0],
                                    },
                                ],
                            },
                        ],
                    });
                } else {
                    console.log(err);
                }
            });
            stream.destroy();
            fs.unlink(`${title}.mp3`, () => {});
        });
    },
};
