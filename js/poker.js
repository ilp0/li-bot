module.exports = {
    checkPokerHand: function (unsorted){
        let hand = unsorted.sort((a,b) => {
            return a[0]-b[0] 
        })
        console.log("KÄSI:\n");
        console.log(hand)
        let handRank = 0;
        if(checkFlush(hand)) {
            handRank = 5;
        }
        //väri
        switch(checkStraight(hand)){
            case "STR":
                if(handRank < 4) handRank = 4;
                break;
            case "STR_FLUSH":
                if(handRank < 8) handRank = 8;
                break;
            case "STR_ROYAL_FLUSH":
                if(handRank < 9) handRank = 9;
                break;
            }

        switch(checkPair(hand)){
            case "QUADS":
                if(handRank < 7) handRank = 7;
                break;
            case "FULLHOUSE":
                if(handRank < 6) handRank = 6;
                break;
            case "THREE_OF_A_KIND":
                if(handRank < 3) handRank = 3;
                break;
            case "TWO_PAIR" :
                if(handRank < 2) handRank = 2;
                break;
            case "PAIR" :
                if(handRank < 1) handRank = 1;
                break;
                
            }
            console.log(handRank);
            return handRank;
        } 

    }

function checkFlush(hand){
    let samaMaa = 0;
    hand.map(c => {
        if(c[1] == hand[0][1]) samaMaa++
    });
    if(samaMaa == 5) return true
    else return false
}

function checkPair(hand){
    let pairs = new Array();
    hand.map((c,i) => {
        hand.map((c2,i2) => {
            if(c[0] == c2[0] && i != i2) {
                pairs.push([c,c2])
            }
        })
    })
    if(pairs.length == 12) return "QUADS"
    else if(pairs.length == 8) return "FULLHOUSE"
    else if(pairs.length == 6) return "THREE_OF_A_KIND"
    else if(pairs.length == 4 ) return "TWO_PAIR"
    else if(pairs.length == 2) return "PAIR"
    else return ""
}

function checkStraight(hand){

    let straight = 0;
    hand.map((c,i) => {
        if(i !=4) { if(c[0] == hand[i+1][0]-1) straight++; }
        else if(c[0] == hand[i-1][0]+1) straight++;
    });
    let result = "";
    if (straight == 5) {
        if(checkFlush(hand)) {
            if(hand[0][0] == 10) result = ("STR_ROYAL_FLUSH")
            else result = ("STR_FLUSH")
        }
        else result = ("STR")
    }
    return result;
}
