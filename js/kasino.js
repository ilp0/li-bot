/*
*
*
* Kasino
*
*
*/
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

    flip: function (bet, message, con) {
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

    bj: function (){

    }
}
