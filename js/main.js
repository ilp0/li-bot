//discord libs
var Discord = require('discord.js');
//logging lib
var logger = require('winston');
//mysql lib
var mysql = require('mysql');
//for reading and writing files
var fs = require('fs');
//prefix for
const prefix = "!";
//card deck for blackjack
const bjDeck = [2,3,4,5,6,7,8,9,10,10,10,10,11];

const eArr = [];

var bjSessions = [{}];
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
    //init emojis
    eArr[0] = b.emojis.find(emoji => emoji.name === "kunnonkaarisuu");
    eArr[1] = b.emojis.find(emoji => emoji.name === "panther");
    eArr[2] = b.emojis.find(emoji => emoji.name === "risti");
    eArr[3] = b.emojis.find(emoji => emoji.name === "kaori");
    eArr[4] = b.emojis.find(emoji => emoji.name === "peek");
    eArr[5] = b.emojis.find(emoji => emoji.name === "coolboy");
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
                var text = "```AVAILABLE COMMANDS: \n !j -- random j quote \n !rr -- russian roulette game \n !rand <input> -- random number generator \n !k <command> <bet-size> -- kasino games \n    register\n    saldo\n    flip\n    bj\n    slots\n !help -- shows this message``` \nBot source code available @ https://github.com/ilp0/li-bot";
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
            case 'will':
                if(message.member.voiceChannel) {
                    message.member.voiceChannel.join()
                    .then(connection => {
                        const dispatcher = connection.playFile('misc/audio/fortnite-will-smith.mp4', {passes: 3, volume: 0.4});
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
            
            case 'k':
                switch (args[0]){
                    case 'register':
                        con.query("SELECT * FROM user WHERE id = " + con.escape(message.member.id), (err, result, field) => {
                            if (!err && result.length == 0){
                                con.query("INSERT INTO user (id, name, money) VALUES (" + con.escape(message.member.id) + ", " + con.escape(message.member.displayName) + ", 500)", (err, result, field) => {
                                    message.reply("Pelitili luotu! Rekisteröimisbonus 500 li-coinia!")
                                });
                            } else {
                                message.reply("Olet jo rekisteröitynyt");
                            }
                        });
                        

                    break;
                    case 'saldo':
                        con.query("SELECT money FROM user WHERE id = " + con.escape(message.member.id), (err, result, field) => {
                            if (!err && result.length != 0) {
                                message.reply("Pelitililläsi on " + result[0].money + " li-coinia");
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
                                    var side = Math.floor(Math.random() * 50);
                                    if (side === 25) {
                                        message.reply("Kolikko tippui sivulleen. Hävisit " + (bet) + " li-coinia. Saldosi on "+ (result[0].money - bet));
                                        con.query("UPDATE user SET money = money -" + con.escape(bet) + " WHERE id = " + con.escape(message.member.id));

                                    } else if (coin === 0) {
                                        message.reply("Kruuna, voitit " + (bet*2) + " li-coinia. Saldosi on " + (result[0].money + bet));
                                        con.query("UPDATE user SET money = money +" + con.escape(bet) + " WHERE id = " + con.escape(message.member.id)); 
                                    } else {
                                        message.reply("Klaava, hävisit "+ bet + " li-coinia. Saldosi on " + (result[0].money - bet));
                                        con.query("UPDATE user SET money = money -" + con.escape(bet) + " WHERE id = " + con.escape(message.member.id));
                                    } 
                                } else {
                                    message.reply("Ei pelioikeutta kyseisellä panoksella. Pelitililläsi on " + result[0].money + " li-coinia");
                                }
                                
                            } else {
                                message.reply("Error! Onko sinulla varmasti pelitili?");
                            }
                        });
                        
                    break;
                    case 'bj':{
                        switch (args[1]){
                            case 'new': 
                                bjSessions.map((session, i) => {
                                if(session.status === "active" && session.id === message.member.id){

                                } else {
                                    bet = parseInt(args[2], 10);
                                    con.query("SELECT money FROM user WHERE id = " + con.escape(message.member.id), (err, result, field) => {
                                    if (!err && result.length != 0) {
                                        if(result[0].money >= bet && bet > 0){
                                            let hand = [bjDeck[Math.floor(Math.random() * bjDeck.length)],bjDeck[Math.floor(Math.random() * bjDeck.length)]];
                                            let dealerHand = [bjDeck[Math.floor(Math.random() * bjDeck.length)], bjDeck[Math.floor(Math.random() * bjDeck.length)]];
                                            message.reply("\nKätesi: " + hand[0] + " " + hand[1] + " = " + (hand[0] + hand[1] + "\nJakajan käsi: " + dealerHand[0] + " X" + "\n!k bj hit || !k bj stay"));
                                            let gameStatus = "active";
                                            bjSessions.push({id: message.member.id, bet: bet, hand: hand, dealerHand: dealerHand, status: gameStatus });
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
                                bjSessions.map((session, i) => {
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
                                        bjSessions[i] = session;
                                        if(total > 21) {
                                            let isDiscounted = false;
                                            session.hand.map((c, i) => {
                                                if (c === 11 && !isDiscounted) {
                                                    session.hand[i] = 1;
                                                    total -= 10;
                                                    isDiscounted = true;
                                                    bjSessions[i] = session;

                                                }
                                            });
                                            if(total > 21){
                                                message.reply("Yli 21. Hävisit " + session.bet + " li-coinia.");
                                                session.gameStatus = "inactive";
                                                con.query("UPDATE user SET money = money -" + con.escape(session.bet) + " WHERE id = " + con.escape(session.id)); 
                                                bjSessions.splice(i, 1);
                                            }

                                        } 
                                    }
                                });
                            break;
                            case 'stay':
                                bjSessions.map((session, i) => {
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
                                            bjSessions.splice(i, 1);
                                    }
                                });
                                //if (!isGame) message.reply("Error! Peliä ei löytynyt. Kokeile `!k bj new <bet>`");
                            break;
                        }
                    }
                    break;
                    case "slots":
                    bet = parseInt(args[1], 10);
                    con.query("SELECT money FROM user WHERE id = " + con.escape(message.member.id), (err, result, field) => {
                        if (!err && result.length != 0) {
                            if(result[0].money >= bet && bet > 0){
                               //slots koodit
                               /*
                               yhdistelmät:
                               :) :) X = rahat takaisin
                               :) :) :) = 5x rahat
                               :D X X = rahat takaisin
                               :D :D X = 4x rahat
                               :D :D :D = 20x rahat
                               XD XD X = 8x rahat
                               XD XD XD = 25x rahat
                               gold gold gold = 50x rahat
                               Jokeri = wild 
                               */
                              let row = Create2DArray(3);
                               for (let i = 0; i < 3; i++){
                                row[0][i] = eArr[Math.floor(Math.random() * eArr.length)];
                                row[1][i] = eArr[Math.floor(Math.random() * eArr.length)];
                                row[2][i] = eArr[Math.floor(Math.random() * eArr.length)];
                               }
                               message.reply("Result:\n"    + row[0][0] + " X X\n"
                                                            + row[1][0] + " X X\n" 
                                                            + row[2][0] + " X X\n")
                               .then((msg) => {
                                   setTimeout(function (){
                                       msg.edit("Result:\n" + row[0][0] + " " + row[0][1] + " X\n"
                                                            + row[1][0] + " " + row[1][1] + " X\n"
                                                            + row[2][0] + " " + row[2][1] + " X\n")
                                       .then((mesg) => {
                                        setTimeout(function (){
                                            let finalString = "Result:\n"   + row[0][0] + " " + row[0][1] + " " + row[0][2] + "\n" 
                                                                            + row[1][0] + " " + row[1][1] + " " + row[1][2] + "\n" 
                                                                            + row[2][0] + " " + row[2][1] + " " + row[2][2] + "\n";
                                            let noWin = true;
                                            for(let i = 0; i<3; i++){
                                                if (row[i][0] === row[i][1]){
                                                    noWin = false;
                                                    if(row[i][0] === row[i][2]){
                                                    // kolme samaa
                                                    switch(row[i][0]){
                                                        case eArr[0]:
                                                        finalString += ("HAPPY BONUS! PANOS X 8\n");
                                                        break;
                                                        case eArr[1]:
                                                        finalString += ("JUST PANTHER " + eArr[1] + " PANOS X 15\n");
                                                        break;
                                                        case eArr[2]:
                                                        finalString += ("SUPER RISTI VOITTO! PANOS X 10\n");
                                                        break;
                                                        case eArr[3]:
                                                        finalString += ("SUPER ANIME VOITTO!!!! PANOS X 25\n");
                                                        break;
                                                        case eArr[4]:
                                                        finalString += ("Uskomaton pleikkarivässykkä bonus PANOS X 10\n");
                                                        break;
                                                        case eArr[5]:
                                                        finalString += ("(jac)XBOT! PANOS X 30\n");
                                                        break;
                                                    }
                                                } else {
                                                    // kaksi samaa
                                                    switch(row[i][0]){
                                                        case eArr[0]:
                                                        finalString += ("Sentti on miljoonan alku. PANOS X 1\n");
                                                        break;
                                                        case eArr[1]:
                                                        finalString += ("Pientä pantheria. " + eArr[1] + " PANOS X 4\n");
                                                        break;
                                                        case eArr[2]:
                                                        finalString += (eArr[2] + eArr[2] + " PANOS X 3\n");
                                                        break;
                                                        case eArr[3]:
                                                        finalString += ("SMALL ANIME VOITTO! PANOS X 7\n");
                                                        break;
                                                        case eArr[4]:
                                                        finalString += ("Pikku pleikkarivässykkä bonus PANOS X 3\n");
                                                        break;
                                                        case eArr[5]:
                                                        finalString += ("PIENI (jac)XBOT! PANOS X 10\n");
                                                        break;
                                                    }
                                                }
                                            }
                                            
                                            
                                        }
                                        
                                        if(noWin) {
                                            finalString += ("Ei voittoa :(\n");
                                        }
                                        let saldoString = "\nSaldo: " + result[0].money + " li-coinia";
                                        finalString += saldoString;
                                        mesg.edit(finalString);
                                            
                                        }, 1000);
                                    });
                                    },1000)
                               });
                            } else {
                                message.reply("Ei pelioikeutta kyseisellä panoksella. Pelitililläsi on " + result[0].money + " li-coinia");
                            }
                            
                        } else {
                            message.reply("Error! Onko sinulla varmasti pelitili?");
                        }
                    });
                    break;
                    default: 
                        message.reply("Virheellinen kasino-komento. Yritä uudelleen.");
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

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }
function Create2DArray(rows) {
    var arr = [];
  
    for (var i=0;i<rows;i++) {
       arr[i] = [];
    }
  
    return arr;
  }