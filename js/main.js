//discord libs
var Discord = require('discord.js');
//logging lib
var logger = require('winston');
//mysql lib
var mysql = require('mysql');
//for reading and writing files
var fs = require('fs');

const prefix = "!";

//logger stuff
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize:true
});
logger.level = 'debug';
//russian roulette chamber variable
var rrChamber = 6;
//new bot
var b = new Discord.Client();
//login
b.on('ready', () => {
    logger.info('Connected to server');
});
//on message
b.on('message', message => {
    logger.info('message' + message);
    //if message has ! in the beginning
    if(message.content.startsWith("!")) {
        //parse the message and args to args array
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
        //switch for the commands
        switch (cmd) {
            case 'j':
                var text;
                fs.readFile('misc/input.txt', 'utf8', function(err, contents) {
                    var all = contents;
                    var splitted = all.split('\n');
                    var random = Math.floor(Math.random() * splitted.length);
                    text = splitted[random];
                    message.reply(text);
                });
                break;
            //russian roulette game
            case 'rr':
                text = russianRoulette();
                message.reply(text);
                break;
            //random number generator
            case 'rand':
                var num = args[0];
                var text = Math.floor(Math.random() * parseInt(num, 10));
                message.reply(text);
                break;
            //help
            case 'help':
                var text = "```AVAILABLE COMMANDS: \n !j -- random j quote \n !rr -- russian roulette game \n !rand <input> -- random number generator \n !help -- shows this message``` \nBot source code available @ https://github.com/ilp0/li-bot";
                message.reply(text);
                break;
            //play ben shapiro
            case 'ben':
                if(message.member.voiceChannel) {
                    message.member.voiceChannel.join()
                    .then(connection => {
                        const dispatcher = connection.playFile('misc/audio/fortnite-ben-shapiro.mp3', {passes: 3, volume: 0.4});
                        dispatcher.on("end", end => {
                            message.member.voiceChannel.leave();
                        });
                    })
                    .catch(console.log);
                } else {
                    message.reply('You are not in a voice channel I could join. >:(')
                }
            
            break;
            //istun poikittain
            case 'istun-poikittain':
                if(message.member.voiceChannel) {
                    message.member.voiceChannel.join()
                    .then(connection => {
                        const dispatcher = connection.playFile('misc/audio/istun-poikittain.mp3', {passes: 3, volume: 0.4});
                        dispatcher.on("end", end => {
                            message.member.voiceChannel.leave();
                        });
                    })
                    .catch(console.log);
                } else {
                    message.reply('You are not in a voice channel I could join. >:(')
                }
            
            break;
            //join voice channel
            case 'join':
                if(message.member.voiceChannel) {
                    message.member.voiceChannel.join()
                    .then(connection => {

                    })
                    .catch(console.log);
                } else {
                    message.reply('You are not in a voice channel I could join. >:(')
                }
                break;
            
            case 'casino':
                switch (args[0]){
                    case 'register':
                        con.query("SELECT * FROM user WHERE id = " + con.escape(message.member.id), (err, result, field) => {
                            if (!err && result.length == 0){
                                con.query("INSERT INTO user (id, name, money) VALUES (" + con.escape(message.member.id) + ", " + con.escape(message.member.displayName) + ", 500)", (err, result, field) => {
                                    message.reply("Pelitili luotu! Rekisteröimisbonus 500 kolikkoa!")
                                });
                            } else {
                                message.reply("Olet jo rekisteröitynyt");
                            }
                        });
                        

                    break;
                    case 'saldo':
                        con.query("SELECT money FROM user WHERE id = " + con.escape(message.member.id), (err, result, field) => {
                            if (!err && result.length != 0) {
                                message.reply("Pelitililläsi on " + result[0].money + " kolikkoa");
                            } else {
                                message.reply("Error! Onko sinulla varmasti pelitili?");
                            }
                        });
                    break;
                    case 'flip':
                        bet = parseInt(args[1], 10);
                        con.query("SELECT money FROM user WHERE id = " + con.escape(message.member.id), (err, result, field) => {
                            if (!err && result.length != 0) {
                                if(result[0].money >= bet && bet > 0){
                                    var coin = Math.floor(Math.random() * 2);
                                    if (coin === 0) {
                                        message.reply("Kruuna, voitit " + (bet*2) + " kolikkoa. Saldosi on " + (result[0].money + bet));
                                        con.query("UPDATE user SET money = money +" + con.escape(bet) + " WHERE id = " + con.escape(message.member.id)); 
                                    } else {
                                        message.reply("Klaava, hävisit "+ bet + " kolikkoa. Saldosi on " + (result[0].money - bet));
                                        con.query("UPDATE user SET money = money -" + con.escape(bet) + " WHERE id = " + con.escape(message.member.id));
                                    } 
                                } else {
                                    message.reply("Ei pelioikeutta kyseisellä panoksella. Pelitililläsi on " + result[0].money + " kolikkoa");
                                }
                                
                            } else {
                                message.reply("Error! Onko sinulla varmasti pelitili?");
                            }
                        });
                        
                    break;
                    }
        }
    }
});

function russianRoulette() {
    var text = "*click*";
    var random = Math.floor(Math.random() * rrChamber);
    rrChamber--;
    if (random === 0) {
        text = "```THERE'S NO WAY OUT\n HELP ME\n HOW DID HE GET OUT\n I CAN'T SEE\n WHO ARE YOU\n THERE IS NO HOPE\n WHY DID IT HAVE TO BE ME\n WHAT HAVE I DONE TO DESERVE THIS\n KILL ME``` **reloading**";
        rrChamber = 6
    } else {
        text = "*click* " + rrChamber + " left.";
    }
    return text;
}

var sqlCreds = JSON.parse(fs.readFileSync('misc/mysql.json', 'utf8'));
// create connection variable
var con = mysql.createConnection({
    host: sqlCreds.db.host,
    user: sqlCreds.db.user,
    password: sqlCreds.db.password,
    database: sqlCreds.db.database
});
//connect
con.connect(function(err) {
    if (err) throw err;
    console.log("MySQL:     [OK]");
});

fs.readFile('misc/auth.txt', 'utf8', function(err, contents) {
    console.log("trying to auth");
    b.login(contents);
});
