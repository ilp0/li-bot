/*
*
*
* AUDIO
*
*
*/
module.exports = {
    playClip: function (message, path) {
        if(message.member.voiceChannel) {
            message.member.voiceChannel.join()
            .then(connection => {
                const dispatcher = connection.playFile(path, {passes: 3, volume: 0.4});
                dispatcher.on("end", end => {
                    message.member.voiceChannel.leave();
                });
            })
            .catch(console.log);
        } else {
            message.reply('You are not in a voice channel I could join. >:(')
        }
    },
    rand: function (args, message) {
        var num = args[0];
        var text = Math.floor(Math.random() * parseInt(num, 10));
        message.reply(text);
    }
}

