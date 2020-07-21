/*
*
*
* RUSSIAN ROULETTE
*
*
*/
module.exports = {
    russianRoulette: function (rrChamber) {
        
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
}



