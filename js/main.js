var Discord = require('discord.io');
var logger = require('winston');
var authentication = require('../misc/auth.json');
var fs = require('fs');

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize:true
});
logger.level = 'debug';

var rrChamber = 6;

var b = new Discord.Client({
    token:authentication.token,
    autorun:true
});

b.on('ready', function (event) {
    logger.info('Connected to server');
    logger.info('Logged in as: ');
    logger.info(b.username);
});

b.on('message', function (user, userID, channelID, message, evt) {
    logger.info('message' + message);
    if(message.substring(0,1)=='!') {
        var args = message.substring(1).split(' ');
        var userInput = args[1];
        console.log(userInput);
        var cmd = args[0];
        args = args.splice(1);
        switch (cmd) {
            case 'j':
                var text;
                fs.readFile('misc/input.txt', 'utf8', function(err, contents) {
                    var all = contents;
                    var splitted = all.split('\n');
                    var random = Math.floor(Math.random() * splitted.length);
                    text = splitted[random];
                    b.sendMessage({
                    to:channelID,
                    message: text
                    });
                });
                break;
            case 'rr':
                var text = "*click*";
                var random = Math.floor(Math.random() * rrChamber);
                rrChamber--;
                if (random === 0) {
                    text = "```THERE'S NO WAY OUT\n HELP ME\n HOW DID HE GET OUT\n I CAN'T SEE\n WHO ARE YOU\n THERE IS NO HOPE\n WHY DID IT HAVE TO BE ME\n WHAT HAVE I DONE TO DESERVE THIS\n KILL ME``` **reloading**";
                    rrChamber = 6
                } else {
                    text = "*click* " + rrChamber + " left.";
                }
                b.sendMessage({
                    to:channelID,
                    message: text
                });
                break;
            case 'rand':
                var num = userInput;
                var text = Math.floor(Math.random() * parseInt(num, 10));
                b.sendMessage({
                    to:channelID,
                    message: text
                });
                break;
            case 'help':
                var text = "```AVAILABLE COMMANDS: \n !j -- random j quote \n !rr -- russian roulette game \n !rand <input> -- random number generator \n !help -- shows this message``` \nBot source code available @ https://github.com/ilp0/li-bot";
                b.sendMessage({
                    to:channelID,
                    message: text
                });
        }
    }
});
