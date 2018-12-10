/*
*
*
* Kasino
*
*
*/
let misc = require('./misc');

module.exports = {
    register: function (message, con) {
        con.query("SELECT * FROM user WHERE id = " + con.escape(message.member.id), (err, result, field) => {
            if (!err && result.length == 0){
                con.query("INSERT INTO user (id, name, money) VALUES (" + con.escape(message.member.id) + ", " + con.escape(message.member.displayName) + ", 500)", (err, result, field) => {
                    message.reply("Pelitili luotu! Rekisteröimisbonus 500 li-coinia!")
                });
            } else {
                message.reply("Olet jo rekisteröitynyt");
            }
        });
    },

    saldo: function (message, con) {
        con.query("SELECT money FROM user WHERE id = " + con.escape(message.member.id), (err, result, field) => {
            if (!err && result.length != 0) {
                message.reply("Pelitililläsi on " + result[0].money + " li-coinia");
            } else {
                message.reply("Error! Onko sinulla varmasti pelitili?");
            }
        });
    },
    //coinflip
    flip: function (bet, message, con, args, sessions) {
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
    },
    //blackjack
    bj: function (){

    },
    //slots
    slots: function (sessions, args, message, con) {
        let bet = parseInt(args[1], 10);
        let gameFound = false;
        sessions.map((session, i) => {
            if(session.id === message.member.id && session.game === "slots"){
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
                                    for(let i = 0; i<3; i++){
                                        if (row[i][0] === row[i][1]){
                                            noWin = false;
                                            if(row[i][0] === row[i][2]){
                                            // kolme samaa
                                            switch(row[i][0]){
                                                case eArr[0]:
                                                finalString += ("HAPPY BONUS! " + (bet * 6) + " li-coinia\n");
                                                con.query("UPDATE user SET money = money +" + (con.escape(bet) * 6) + " WHERE id = " + con.escape(id)); 
                                                break;
                                                case eArr[1]:
                                                finalString += ("JUST PANTHER " + eArr[1] + " " + (bet * 7) + " li-coinia\n");
                                                con.query("UPDATE user SET money = money +" + (con.escape(bet) * 7) + " WHERE id = " + con.escape(id)); 
                                                break;
                                                case eArr[2]:
                                                finalString += ("SUPER RISTI VOITTO! " + (bet * 8) + " li-coinia\n");
                                                con.query("UPDATE user SET money = money +" + (con.escape(bet) * 8) + " WHERE id = " + con.escape(id)); 
                                                break;
                                                case eArr[3]:
                                                finalString += ("SUPER ANIME VOITTO!!!! " + (bet * 12) + " li-coinia\n");
                                                con.query("UPDATE user SET money = money +" + (con.escape(bet) * 12) + " WHERE id = " + con.escape(id)); 
                                                break;
                                                case eArr[4]:
                                                finalString += ("Uskomaton pleikkarivässykkä bonus! " + (bet * 6) + " li-coinia\n");
                                                con.query("UPDATE user SET money = money +" + (con.escape(bet) * 6) + " WHERE id = " + con.escape(id)); 
        
                                                break;
                                                case eArr[5]:
                                                finalString += ("(jac)XBOT! " + (bet * 17) + " li-coinia\n");
                                                con.query("UPDATE user SET money = money +" + (con.escape(bet) * 17) + " WHERE id = " + con.escape(id)); 
        
                                                break;
                                                case eArr[6]:
                                                finalString += ("SUPERNUT SUPER VOITTO! " + (bet * 10) + " li-coinia\n");
                                                con.query("UPDATE user SET money = money +" + (con.escape(bet) * 10) + " WHERE id = " + con.escape(id)); 
        
                                                break;
                                                case eArr[7]:
                                                finalString += ("MAANPUOLUSTUS EI OLE MIKÄÄN MONIVALINTAKYSYMYS!!! " + (bet * 1) + " li-coinia\n");
                                                con.query("UPDATE user SET money = money +" + (con.escape(bet) * 1) + " WHERE id = " + con.escape(id)); 
        
                                                break;
                                            }
                                        } else {
                                            // kaksi samaa
                                            switch(row[i][0]){
                                                case eArr[0]:
                                                finalString += ("Sentti on miljoonan alku. " + (bet * 1) + " li-coinia\n");
                                                con.query("UPDATE user SET money = money +" + (con.escape(bet) * 1) + " WHERE id = " + con.escape(id)); 
                                                break;
                                                case eArr[1]:
                                                finalString += ("Pientä pantheria. " + eArr[1] +  " " + Math.floor(bet * 1.5) + " li-coinia\n");
                                                con.query("UPDATE user SET money = money +" + Math.floor(con.escape(bet) * 1.5) + " WHERE id = " + con.escape(id)); 
                                                break;
                                                case eArr[2]:
                                                finalString += ("Pieni risti voitto! " + (bet * 2) + " li-coinia\n");;
                                                con.query("UPDATE user SET money = money +" + (con.escape(bet) * 2) + " WHERE id = " + con.escape(id)); 
                                                break;
                                                case eArr[3]:
                                                finalString += ("SMALL ANIME VOITTO! " + Math.floor(bet * 3) + " li-coinia\n");;
                                                con.query("UPDATE user SET money = money +" + (con.escape(bet) * 3) + " WHERE id = " + con.escape(id)); 
                                                break;
                                                case eArr[4]:
                                                finalString += ("Pikku pleikkarivässykkä bonus. " + (bet * 2) + " li-coinia\n");
                                                con.query("UPDATE user SET money = money +" + (con.escape(bet) * 2) + " WHERE id = " + con.escape(id)); 
                                                break;
                                                case eArr[5]:
                                                finalString += ("PIENI (jac)XBOT! " + (bet * 4) + " li-coinia\n");
                                                con.query("UPDATE user SET money = money +" + (con.escape(bet) * 4) + " WHERE id = " + con.escape(id)); 
                                                break;
                                                case eArr[6]:
                                                finalString += ("SUPERNUT MEDIUM VOITTO! " + (bet * 3) + " li-coinia\n");
                                                con.query("UPDATE user SET money = money +" + (con.escape(bet) * 3) + " WHERE id = " + con.escape(id)); 
        
                                                break;
                                                case eArr[7]:
                                                finalString += ("ASEET KÄTEEN POJAT!!!!! " + (bet * 1) + " li-coinia\n");
                                                con.query("UPDATE user SET money = money +" + (con.escape(bet) * 1) + " WHERE id = " + con.escape(id)); 
        
                                                break;
                                            }
                                        }
                                    }
                                    
                                }
                                con.query("UPDATE user SET money = money -" + con.escape(bet) + " WHERE id = " + con.escape(id)); 
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
    }
}
