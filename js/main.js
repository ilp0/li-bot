
var Discord = require('discord.js');                //discord libs
var logger = require('winston');                    //logging lib
var mysql = require('mysql');                       //mysql lib
var fs = require('fs');                             //for reading and writing files
var rr = require('./rr');                           //for russianroulette
var kasino = require('./kasino');
var misc = require('./misc')
var audio = require('./audio')
const rrChamber = 6;                                //russian roulette chamber variable
const prefix = "!";                                 //prefix for commands
const bjDeck = [2,3,4,5,6,7,8,9,10,10,10,10,11];    //card deck for blackjack
const eArr = [];                                    //emoji array
var sessions = [{}];                                //session array for casino games
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

let leaderUpdater = setInterval(() => {
    con.query("SELECT * FROM user ORDER BY money DESC", (err, result, field) => {
        if(!err && result.length > 0) {
            b.guilds.array().map((g) => {
                let cLeaderRole = g.roles.find(role => role.name === "CHIP-LEADER")
                cLeaderRole.members.map((mem) => {
                    mem.removeRole(cLeaderRole).catch(console.error);
                }); 
                let cLeader = g.members.get(result[0].id);
                cLeader.addRole(cLeaderRole).catch(console.error);
            });
            
        }
    });
}, 30000);

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
            /*
            *
            *
            *
            *   KASINO KOODIT!
            * 
            * 
            */
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
                    case 'bj':{
                        switch (args[1]){
                            case 'new': 
                                sessions.map((session, i) => {
                                if(session.game === "bj" && session.id === message.member.id){
                                    message.reply("Sinulla on jo Blackjack peli käynnissä.");
                                } else {
                                    bet = parseInt(args[2], 10);
                                    con.query("SELECT money FROM user WHERE id = " + con.escape(message.member.id), (err, result, field) => {
                                    if (!err && result.length != 0) {
                                        if(result[0].money >= bet && bet > 0){
                                            let hand = [bjDeck[Math.floor(Math.random() * bjDeck.length)],bjDeck[Math.floor(Math.random() * bjDeck.length)]];
                                            let dealerHand = [bjDeck[Math.floor(Math.random() * bjDeck.length)], bjDeck[Math.floor(Math.random() * bjDeck.length)]];
                                            message.reply("\nKätesi: " + hand[0] + " " + hand[1] + " = " + (hand[0] + hand[1] + "\nJakajan käsi: " + dealerHand[0] + " X" + "\n!k bj hit || !k bj stay"));
                                            let gameStatus = "active";
                                            sessions.push({game: "bj",id: message.member.id, bet: bet, hand: hand, dealerHand: dealerHand, status: gameStatus });
                                        } else {
                                            message.reply("Ei pelioikeutta kyseisellä panoksella. Pelitililläsi on " + result[0].money + " li-coinia");
                                        }
                                    } else {
                                        message.reply("Error! Onko sinulla varmasti pelitili?");
                                    }
                                    });
                                }
                                });
                            break;
                            case 'hit':
                                let isGame = false; 
                                let newCard;
                                sessions.map((session, i) => {
                                    if (session.id === message.member.id && session.status === 'active'){
                                        let handString = "";
                                        let total = 0;
                                        session.hand.map((card,i) => {
                                            handString += card + " ";
                                            total += card;
                                        });
                                        newCard = bjDeck[Math.floor(Math.random() * bjDeck.length)]
                                        session.hand.push(newCard);
                                        total += newCard;
                                        handString += newCard + " ";
                                        message.reply("Your new hand: " + handString + " = " + total);
                                        sessions[i] = session;
                                        if(total > 21) {
                                            let isDiscounted = false;
                                            session.hand.map((c, i) => {
                                                if (c === 11 && !isDiscounted) {
                                                    session.hand[i] = 1;
                                                    total -= 10;
                                                    isDiscounted = true;
                                                    sessions[i] = session;

                                                }
                                            });
                                            if(total > 21){
                                                message.reply("Yli 21. Hävisit " + session.bet + " li-coinia.");
                                                session.gameStatus = "inactive";
                                                con.query("UPDATE user SET money = money -" + con.escape(session.bet) + " WHERE id = " + con.escape(session.id)); 
                                                sessions.map((s, index) => {
                                                    if(s.id === session.id && s.game === "bj") sessions.splice(index,1);
                                                });
                                            }

                                        } 
                                    }
                                });
                            break;
                            case 'stay':
                                sessions.map((session, i) => {
                                    if (session.status === "active" && session.id === message.member.id){
                                        if (session.id === message.member.id){
                                            let handString = "";
                                            let dealerHandString = ""; 
                                            let dealerTotal = 0;
                                            let playerTotal = 0;
                                            let newCard = 0;
                                            session.dealerHand.map((card,i) => {
                                                dealerHandString += card + " ";
                                                dealerTotal += card;
                                            });
                                            session.hand.map((card,i) => {
                                                handString += card + " ";
                                                playerTotal += card;
                                            });
                                            message.reply("\nSinun käsi: " + handString + " = " + playerTotal + "\n Jakajan käsi: " + dealerHandString + " = " + dealerTotal);
                                            while (dealerTotal < 16) {
                                                //hit
                                                newCard = bjDeck[Math.floor(Math.random() * bjDeck.length)];
                                                session.dealerHand.push(newCard);
                                                dealerTotal += newCard;
                                                dealerHandString += newCard + " ";
                                                if (dealerTotal > 21 && playerTotal !== 21) {
                                                    //dealer loses
                                                    message.reply("\n hand: " + handString + " = " + playerTotal + "\nJakajan käsi: " + dealerHandString + " = " + dealerTotal);
                                                    message.reply("Jakajalla meni yli! Voitit " + (session.bet * 2) + " li-coinia.");
                                                    console.log("Jakajalla meni yli! Voitit " + (session.bet * 2) + " li-coinia.");
                                                    con.query("UPDATE user SET money = money +" + con.escape(session.bet) + " WHERE id = " + con.escape(message.member.id)); 
                                                } else if (playerTotal === 21){
                                                    //BLACKJACK
                                                    message.reply("\n hand: " + handString + " = " + playerTotal + "\nJakajan käsi: " + dealerHandString + " = " + dealerTotal);
                                                    message.reply("BLACKJACK! VOITIT " + (session.bet + (session.bet * 1.5)) + " li-coinia!");
                                                    console.log("BLACKJACK! VOITIT " + (session.bet + (session.bet * 1.5)) + " li-coinia!");
                                                    con.query("UPDATE user SET money = money +" + con.escape(Math.floor(session.bet * 1.5)) + " WHERE id = " + con.escape(session.id)); 
                                                } else if (playerTotal > dealerTotal && dealerTotal >= 16 && dealerTotal <= 21) {
                                                    //pelaaja voittaa
                                                    message.reply("\n hand: " + handString + " = " + playerTotal + "\nJakajan käsi: " + dealerHandString + " = " + dealerTotal);
                                                    message.reply("Onnea! Voitit " + (session.bet * 2) + " li-coinia.");
                                                    console.log("Onnea! Voitit " + (session.bet * 2) + " li-coinia.");
                                                    con.query("UPDATE user SET money = money +" + con.escape(session.bet) + " WHERE id = " + con.escape(session.id)); 
                                                } else if (playerTotal === dealerTotal && dealerTotal >= 16) {
                                                    //rahojen palautus
                                                    message.reply("\n hand: " + handString + " = " + playerTotal + "\nJakajan käsi: " + dealerHandString + " = " + dealerTotal);
                                                    message.reply("Tasapeli. Rahojen palautus.")
                                                    console.log("Tasapeli. Rahojen palautus.")
                                                } else if (playerTotal < dealerTotal && dealerTotal >= 16 && dealerTotal <= 21) {
                                                    //pelaaja häviää
                                                    message.reply("\n hand: " + handString + " = " + playerTotal + "\nJakajan käsi: " + dealerHandString + " = " + dealerTotal);
                                                    message.reply("Hävisit jakajalle " + session.bet + " li-coinia.");
                                                    console.log("Hävisit jakajalle " + session.bet + " li-coinia.");
                                                    con.query("UPDATE user SET money = money -" + con.escape(session.bet) + " WHERE id = " + con.escape(session.id)); 

                                                    }
                                                }
                                            }
                                            sessions.map((s, index) => {
                                                if(s.id === session.id && s.game === "bj") sessions.splice(index,1);
                                            });
        
                                            
                                    }
                                });
                            break;
                        }
                    }
                    break;
                    //Slot machine
                    case "slots":
                        kasino.slots(eArr, sessions, args, message, con)
                        break;
                    //check chipleader
                    case "updateleader":
                    con.query("SELECT * FROM user ORDER BY money DESC", (err, result, field) => {
                        if(!err && result.length > 0) {
                            let cLeaderRole = message.guild.roles.find(role => role.name === "CHIP-LEADER");
                            cLeaderRole.members.map((mem, i) => {
                                mem.removeRole(cLeaderRole).catch(console.error);
                            }); 
                            let cLeader = message.guild.members.get(result[0].id);
                            cLeader.addRole(cLeaderRole).catch(console.error);
                            console.log("added new cleader");
                            message.reply("THE LEADER IS " + cLeader.id);
                        }
                    });
                    break;
                    case "give":
                    let giver = message.member.id;
                    let receiver = args[2];
                    let amount = parseInt(args[1], 10);
                    con.query("SELECT * FROM user WHERE name = " + con.escape(receiver), (err, res, field) => {
                        if(!err && res.length !== 0) {
                            con.query("SELECT money FROM user WHERE id = " + con.escape(giver), (erro, result, field) => {
                                if (!erro && result.length !== 0) {
                                    if(result[0].money >= amount && amount > 0){
                                        con.query("UPDATE user SET money = money -" + con.escape(amount) + " WHERE id = " + con.escape(giver)); 
                                        con.query("UPDATE user SET money = money +" + con.escape(amount) + " WHERE name = " + con.escape(receiver)); 
                                        message.reply("Annoit onnistuneesti "+ amount + " li-coinia käyttäjälle " + receiver + ".");
                                    } else {
                                        message.reply("Ei tarpeeksi rahaa antamiseen.");
                                    }
                                }
                            });
                        } else {
                            message.reply("Käyttäjää ei löytynyt.");
                        }
                    });
                    
                    break;
                    default: 
                        message.reply("Virheellinen kasino-komento. Yritä uudelleen.");
                    }
                    break;
                    case "rpg": 
                    message.reply("tulossa pian ;()");
        }
    }
});

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

