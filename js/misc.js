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
        \n    bj
        \n    slots
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
    }
}

