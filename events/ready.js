const { exec } = require("child_process");

module.exports.run = async (client) => {
    let date = new Date();

    console.log('\x1b[33m', `${client.user.tag} (${client.user.id}) has started on ${date}.`);
    client.user.setActivity(
        'Sample Thingy.', {
            type: 'WATCHING'
        });

    client.user.setStatus('online');
}
