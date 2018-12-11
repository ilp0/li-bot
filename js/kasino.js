/*
*
*
* Kasino
*
*
*/
let misc = require('./misc');
const bjDeck = [2,3,4,5,6,7,8,9,10,10,10,10,11];    //card deck for blackjack
const botId = "517830791255031848";
module.exports = {
    register: function (message, con) {
        con.query("SELECT * FROM user WHERE id = " + con.escape(message.member.user.id), (err, result, field) => {
            if (!err && result.length == 0){
                con.query("INSERT INTO user (id, name, money) VALUES (" + con.escape(message.member.user.id) + ", " + con.escape(message.member.displayName) + ", 500)", (err, result, field) => {
                    message.reply("Pelitili luotu! Rekisteröimisbonus 500 li-coinia!")
                });
            } else {
                message.reply("Olet jo rekisteröitynyt");
            }
        });
    },

    saldo: function (message, con) {
        con.query("SELECT money FROM user WHERE id = " + con.escape(message.member.user.id), (err, result, field) => {
            if (!err && result.length != 0) {
                message.reply("Pelitililläsi on " + result[0].money + " li-coinia");
            } else {
                message.reply("Error! Onko sinulla varmasti pelitili?");
            }
        });
    },
    //coinflip
    flip: function (bet, message, con) {
        con.query("SELECT money FROM user WHERE id = " + con.escape(message.member.user.id), (err, result, field) => {
            if (!err && result.length != 0) {
                if(result[0].money >= bet && bet > 0){
                    var coin = Math.floor(Math.random() * 2);
                    var side = Math.floor(Math.random() * 50);
                    if (side === 25) {
                        message.reply("Kolikko tippui sivulleen. Hävisit " + (bet) + " li-coinia. Saldosi on "+ (result[0].money - bet));
                        con.query("UPDATE user SET money = money -" + con.escape(bet) + " WHERE id = " + con.escape(message.member.user.id));
                        con.query("UPDATE user SET money = money +" + con.escape(bet) + " WHERE id = " + con.escape(botId)); 


                    } else if (coin === 0) {
                        message.reply("Kruuna, voitit " + (bet*2) + " li-coinia. Saldosi on " + (result[0].money + bet));
                        con.query("UPDATE user SET money = money +" + con.escape(bet) + " WHERE id = " + con.escape(message.member.user.id)); 
                        con.query("UPDATE user SET money = money -" + con.escape(bet) + " WHERE id = " + con.escape(botId)); 

                    } else {
                        message.reply("Klaava, hävisit "+ bet + " li-coinia. Saldosi on " + (result[0].money - bet));
                        con.query("UPDATE user SET money = money -" + con.escape(bet) + " WHERE id = " + con.escape(message.member.user.id));
                        con.query("UPDATE user SET money = money +" + con.escape(bet) + " WHERE id = " + con.escape(botId)); 

                    } 
                } else {
                    message.reply("Ei pelioikeutta kyseisellä panoksella. Pelitililläsi on " + result[0].money + " li-coinia");
                }
                
            } else {
                message.reply("Error! Onko sinulla varmasti pelitili?");
            }
        });
    },
    //blackjack
    bj: function (sessions, args, message, con){
        switch (args[1]){
            case 'new': 
                sessions.map((session, i) => {
                if(session.game === "bj" && session.id === message.member.user.id){
                    message.reply("Sinulla on jo Blackjack peli käynnissä.");
                } else {
                    bet = parseInt(args[2], 10);
                    con.query("SELECT money FROM user WHERE id = " + con.escape(message.member.user.id), (err, result, field) => {
                    if (!err && result.length != 0) {
                        if(result[0].money >= bet && bet > 0){
                            let hand = [bjDeck[Math.floor(Math.random() * bjDeck.length)],bjDeck[Math.floor(Math.random() * bjDeck.length)]];
                            let dealerHand = [bjDeck[Math.floor(Math.random() * bjDeck.length)], bjDeck[Math.floor(Math.random() * bjDeck.length)]];
                            message.reply("\nKätesi: " + hand[0] + " " + hand[1] + " = " + (hand[0] + hand[1] + "\nJakajan käsi: " + dealerHand[0] + " X" + "\n!k bj hit || !k bj stay"));
                            let gameStatus = "active";
                            sessions.push({game: "bj",id: message.member.user.id, bet: bet, hand: hand, dealerHand: dealerHand, status: gameStatus });
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
                    if (session.id === message.member.user.id && session.status === 'active'){
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
                    if (session.status === "active" && session.id === message.member.user.id){
                        if (session.id === message.member.user.id){
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
                                    message.reply("\nSinun käsi: " + handString + " = " + playerTotal + "\nJakajan käsi: " + dealerHandString + " = " + dealerTotal);
                                    message.reply("Jakajalla meni yli! Voitit " + (session.bet * 2) + " li-coinia.");
                                    console.log("Jakajalla meni yli! Voitit " + (session.bet * 2) + " li-coinia.");
                                    con.query("UPDATE user SET money = money +" + con.escape(session.bet) + " WHERE id = " + con.escape(message.member.user.id)); 
                                } else if (playerTotal === 21){
                                    //BLACKJACK
                                    message.reply("\nSinun käsi: " + handString + " = " + playerTotal + "\nJakajan käsi: " + dealerHandString + " = " + dealerTotal);
                                    message.reply("BLACKJACK! VOITIT " + (session.bet + (session.bet * 1.5)) + " li-coinia!");
                                    console.log("BLACKJACK! VOITIT " + (session.bet + (session.bet * 1.5)) + " li-coinia!");
                                    con.query("UPDATE user SET money = money +" + con.escape(Math.floor(session.bet * 1.5)) + " WHERE id = " + con.escape(session.id)); 
                                } else if (playerTotal > dealerTotal && dealerTotal >= 16 && dealerTotal <= 21) {
                                    //pelaaja voittaa
                                    message.reply("\nSinun käsi: " + handString + " = " + playerTotal + "\nJakajan käsi: " + dealerHandString + " = " + dealerTotal);
                                    message.reply("Onnea! Voitit " + (session.bet * 2) + " li-coinia.");
                                    console.log("Onnea! Voitit " + (session.bet * 2) + " li-coinia.");
                                    con.query("UPDATE user SET money = money +" + con.escape(session.bet) + " WHERE id = " + con.escape(session.id)); 
                                } else if (playerTotal === dealerTotal && dealerTotal >= 16) {
                                    //rahojen palautus
                                    message.reply("\nSinun käsi: " + handString + " = " + playerTotal + "\nJakajan käsi: " + dealerHandString + " = " + dealerTotal);
                                    message.reply("Tasapeli. Rahojen palautus.")
                                    console.log("Tasapeli. Rahojen palautus.")
                                } else if (playerTotal < dealerTotal && dealerTotal >= 16 && dealerTotal <= 21) {
                                    //pelaaja häviää
                                    message.reply("\nSinun käsi: " + handString + " = " + playerTotal + "\nJakajan käsi: " + dealerHandString + " = " + dealerTotal);
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
    },
    //slots
    slots: function (eArr, sessions, args, message, con) {
        let bet = parseInt(args[1], 10);
        let gameFound = false;
        let id = message.member.user.id;
        sessions.map((session, i) => {
            if(session.id === message.member.user.id && session.game === "slots"){
                message.reply("Sinulla on jo Slots peli käynnissä.");
                gameFound = true;
            }
        });
        if(!gameFound){
            con.query("SELECT money FROM user WHERE id = " + con.escape(id), (err, result, field) => {
                if (!err && result.length != 0) {
                    sessions.push({game: "slots",id: id, bet: bet});
        
                    if(result[0].money >= bet && bet > 0){
                    //slots koodit
        
                    let row = misc.Create2DArray(3);
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
                                    let winAmount = 0;
                                    for(let i = 0; i<3; i++){
                                        if (row[i][0] === row[i][1]){
                                            noWin = false;
                                            if(row[i][0] === row[i][2]){
                                            // kolme samaa
                                            switch(row[i][0]){
                                                case eArr[0]:
                                                winAmount +=bet*6;
                                                finalString += ("HAPPY BONUS! " + misc.shortenNum(bet * 6) + " li-coinia\n");
                                                break;
                                                case eArr[1]:
                                                winAmount +=bet*7;
                                                finalString += ("JUST PANTHER " + eArr[1] + " " + misc.shortenNum(bet * 7) + " li-coinia\n");
                                                break;
                                                case eArr[2]:
                                                winAmount +=bet*8;
                                                finalString += ("SUPER RISTI VOITTO! " + misc.shortenNum(bet * 8) + " li-coinia\n");
                                                break;
                                                case eArr[3]:
                                                winAmount +=bet*12;
                                                finalString += ("SUPER ANIME VOITTO!!!! " + misc.shortenNum(bet * 12) + " li-coinia\n");
                                                break;
                                                case eArr[4]:
                                                winAmount +=bet*6;
                                                finalString += ("Uskomaton pleikkarivässykkä bonus! " + misc.shortenNum(bet * 6) + " li-coinia\n");
                                                break;
                                                case eArr[5]:
                                                winAmount +=bet*17;
                                                finalString += ("(jac)XBOT! " + misc.shortenNum(bet * 17) + " li-coinia\n");
                                                break;
                                                case eArr[6]:
                                                winAmount +=bet*10;
                                                finalString += ("SUPERNUT SUPER VOITTO! " + misc.shortenNum(bet * 10) + " li-coinia\n");
                                                break;
                                                case eArr[7]:
                                                winAmount +=bet*1;
                                                finalString += ("MAANPUOLUSTUS EI OLE MIKÄÄN MONIVALINTAKYSYMYS!!! " + misc.shortenNum(bet * 1) + " li-coinia\n");
                                                break;
                                            }
                                        } else {
                                            // kaksi samaa
                                            switch(row[i][0]){
                                                case eArr[0]:
                                                winAmount +=bet*1;
                                                finalString += ("Sentti on miljoonan alku. " + misc.shortenNum(bet * 1) + " li-coinia\n");
                                                break;
                                                case eArr[1]:
                                                winAmount +=Math.floor(bet*1.5);
                                                finalString += ("Pientä pantheria. " + eArr[1] +  " " + misc.shortenNum(Math.floor(bet * 1.5)) + " li-coinia\n");
                                                break;
                                                case eArr[2]:
                                                winAmount +=bet*2;
                                                finalString += ("Pieni risti voitto! " + misc.shortenNum(bet * 2) + " li-coinia\n");;
                                                break;
                                                case eArr[3]:
                                                winAmount +=bet*3;
                                                finalString += ("SMALL ANIME VOITTO! " + misc.shortenNum(bet * 3) + " li-coinia\n");;
                                                break;
                                                case eArr[4]:
                                                winAmount +=bet*2;
                                                finalString += ("Pikku pleikkarivässykkä bonus. " + misc.shortenNum(bet * 2) + " li-coinia\n");
                                                break;
                                                case eArr[5]:
                                                winAmount +=bet*4;
                                                finalString += ("PIENI (jac)XBOT! " + misc.shortenNum(bet * 4) + " li-coinia\n");
                                                break;
                                                case eArr[6]:
                                                winAmount +=bet*3;
                                                finalString += ("SUPERNUT MEDIUM VOITTO! " + misc.shortenNum(winAmount) + " li-coinia\n");        
                                                break;
                                                case eArr[7]:
                                                winAmount +=bet*1;
                                                finalString += ("ASEET KÄTEEN POJAT!!!!! " + misc.shortenNum(bet * 1) + " li-coinia\n");        
                                                break;
                                            }
                                        }
                                    }
                                    
                                }
                                con.query("UPDATE user SET money = money +" + con.escape(winAmount) + " WHERE id = " + con.escape(id)); 
                                con.query("UPDATE user SET money = money -" + con.escape(winAmount) + " WHERE id = " + con.escape(botId));
                                con.query("UPDATE user SET money = money -" + con.escape(bet) + " WHERE id = " + con.escape(id)); 
                                con.query("UPDATE user SET money = money +" + con.escape(bet) + " WHERE id = " + con.escape(botId)); 
                                if(noWin) {
                                    finalString += ("Ei voittoa :(\n");
                                }
                                mesg.edit(finalString);
                                sessions.map((s, index) => {
                                    if(s.id === id) sessions.splice(index,1);
                                });
                                }, 1000);
                            });
                            },1000)
                    });
                    } else {
                        message.reply("Ei pelioikeutta kyseisellä panoksella. Pelitililläsi on " + result[0].money + " li-coinia");
                        sessions.map((s, index) => {
                            if(s.id === id) sessions.splice(index,1);
                        });
                    }
                
                } else {
                    message.reply("Error! Onko sinulla varmasti pelitili?");
                
                }
        });
        }
    },

    give: (args, message, con) => {
        let giver = message.member.user.id;
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
    }
}
