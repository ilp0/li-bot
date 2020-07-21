/*
*
*
* MISC
*
*
*/
module.exports = {
    help: function (message) {
        var text = `\`\`\`AVAILABLE COMMANDS: 
        \n !j -- random j quote 
        \n !rr -- russian roulette game 
        \n !rand <input> -- random number generator 
        \n !k <command> <bet-size> -- kasino games 
        \n    register
        \n    saldo
        \n    flip
        \n    bj <action> (<bet>)
        \n          new
        \n          hit
        \n          stay
        \n    slots <bet>
        \n    pp <action> (<bet>)
        \n          new
        \n          sel <seleciton>
        \n    give <amount> <username>
        \n !help -- shows this message\`\`\` 
        \nBot source code available @ https://github.com/ilp0/li-bot`;
        message.reply(text);
    },
    rand: function (args, message) {
        var num = args[0];
        var text = Math.floor(Math.random() * parseInt(num, 10));
        message.reply(text);
    },
    Create2DArray(rows) {
        var arr = [];
  
        for (var i=0;i<rows;i++) {
           arr[i] = [];
        }
      
        return arr;
    },
    convertToSmallNums: (text) => {
        textArray = Array.from(text.toString());
        smallNumbers = ['₀','₁','₂','₃','₄','₅','₆','₇','₈','₉']
        textArray.map((c, ind) => {
            for(let i = 0; i < 10; i++) {
                if(c === i.toString()){
                    c = smallNumbers[i];
                    textArray[ind] = c;
                }
            }
        });
        return textArray.join("");
    },
    shortenNum: (num) => {
        let newNumStr = "";
        num = parseFloat(num);
        if(num >= 1000 || num <= -1000){
            if(num >= 100000 || num <= -100000){
                if(num >= 1000000 || num <= -1000000){
                    newNumStr = (num / 1000000).toFixed(1) + "m"
                } else {
                    newNumStr = (num / 1000).toFixed() + "k"
                }
            } else {
                newNumStr = (num / 1000).toFixed(1) + "k"
            }
        } else {
            newNumStr = num;
        }
        return newNumStr;
    },
    handToString: (hand) => {
        let handString ="";
        hand.map((c,i) => {
            switch(c[0]){
                case 1:
                    c[0] = "A";
                    break;
                case 11:
                    c[0] = "J";
                    break;
                case 12:
                    c[0] = "Q";
                    break;
                case 13:
                    c[0] = "K";
                    break;
            }
            switch(c[1]){
                case 0:
                    handString += (c[0] + ":diamonds: ")
                    break;

                case 1:
                    handString += (c[0] + ":clubs: ")
                    break;

                case 2:
                    handString += (c[0] + ":hearts: ")
                    break;

                case 3:
                    handString += (c[0] + ":spades: ")
                    break;
            }
        })
        return handString;
    }
}

