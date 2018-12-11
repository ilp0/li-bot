
var Discord = require('discord.js');                //discord libs
var logger = require('winston');                    //logging lib
var mysql = require('mysql');                       //mysql lib
var fs = require('fs');                             //for reading and writing files
var rr = require('./rr');                           //for russianroulette
var kasino = require('./kasino');
var misc = require('./misc')
var audio = require('./audio')
var sessions = [{}];
const rrChamber = 6;                                //russian roulette chamber variable
const prefix = "!";                                 //prefix for commands
const eArr = [];                                    //emoji array
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize:true
});
logger.level = 'debug';
//new bot
var b = new Discord.Client();
//login
b.on('ready', () => {
    logger.info('Connected to server');
    //init emojis
    eArr[0] = b.emojis.find(emoji => emoji.name === "kunnonkaarisuu");
    eArr[1] = b.emojis.find(emoji => emoji.name === "panther");
    eArr[2] = b.emojis.find(emoji => emoji.name === "risti");
    eArr[3] = b.emojis.find(emoji => emoji.name === "kaori");
    eArr[4] = b.emojis.find(emoji => emoji.name === "peek");
    eArr[5] = b.emojis.find(emoji => emoji.name === "coolboy");
    eArr[6] = b.emojis.find(emoji => emoji.name === "supernut");
    eArr[7] = b.emojis.find(emoji => emoji.name === "monivalinta");
});
//check who's the chip leader in every server the bot is connected to
let leaderUpdater = setInterval(() => {
    con.query("SELECT * FROM user ORDER BY money DESC", (err, result, field) => {
        if(!err && result.length > 0) {
            b.guilds.array().map((g) => {
                //update nickname
                for (let i = 0; i < result.length; i++) {
                    let membu = g.members.find(m => m.user.id === result[i].id);
                    console.log(membu.user.username);
                    nicknameString = (membu.user.username + " | " + result[i].money + "LC");
                    membu.setNickname(nicknameString)
                    .catch(console.error);
                    console.log(membu.nickname);
                }
                //update the role
                let cLeaderRole = g.roles.find(role => role.name === "CHIP-LEADER")
                cLeaderRole.members.map((mem) => {
                    mem.removeRole(cLeaderRole).catch(console.error);
                }); 
                let cLeader = g.members.get(result[0].id);
                cLeader.addRole(cLeaderRole).catch(console.error);
            });
            
        }
    });
}, 10000);

b.on('message', message => {
    logger.info('message');
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
                text = rr.russianRoulette(rrChamber);
                message.reply(text);
                break;
            //random number generator
            case 'rand':
                misc.rand(args, message);
                break;
            //help
            case 'help':
                misc.help(message);
                break;
            //play ben shapiro
            case 'ben':
                audio.playClip(message, 'misc/audio/fortnite-ben-shapiro.mp3');
                break;
            //will smith fortnite  
            case 'will':
                audio.playClip(message, 'misc/audio/fortnite-will-smith.mp4');
                break;
            //istun poikittain
            case 'istun-poikittain':
                audio.playClip(message, 'misc/audio/istun-poikittain.mp3');
                break;
            //kasinot
            case 'k':
                switch (args[0]){
                    case 'register':
                        kasino.register(message, con);
                    break;
                    case 'saldo':
                        kasino.saldo(message, con);
                        break;
                    case 'flip':
                        kasino.flip(parseInt(args[1], 10), message, con);
                        break;
                    case 'bj':
                        kasino.bj(sessions, args, message, con);
                        break;
                    //Slot machine
                    case "slots":
                        kasino.slots(sessions, eArr, args, message, con)
                        break;
                    case "give":
                        kasino.give(args, message, con)
                        break;
                    default: 
                        message.reply("Virheellinen kasino-komento. Yritä uudelleen.");
                    }
                    break;
                case "rpg": 
                    message.reply("tulossa pian ;()");
                    break;

        }
    }
});

/*
*
*   Authentication and mysql stuff from here!!
*
*/
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

