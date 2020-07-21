# li-bot
Discord bot experiments

# Available commands: 
        
 ### !j -- outputs a random line from input.txt file
        
 ### !rr -- russian roulette game 
        
 ### !rand <input> -- random number generator 
        
 ### !k <command> <bet-size> -- kasino games 
        
    !k register  
    !k saldo   
    !k flip    
    !k bj <action> (<bet>)
          new
          hit
          stay
        
    !k slots <bet>  
    !k pp <action> (<bet>) 
          new
          sel <seleciton>
        
    give <amount> <username>
        
 ### !help
 
# Usage
1. Clone repo 
2. npm install
3. paste your auth token to misc/auth.txt
5. run sql script at sql/li-bot-db.sql on an mysql server and fill in the server details and credentials to the misc/mysql.json
4. npm start
