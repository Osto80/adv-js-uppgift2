const net = require('net');
const readlinePromises = require('readline/promises');
const rl = readlinePromises.createInterface({
    input: process.stdin,
    output: process.stdout
});

const port = 8080; //Port used to connect to server


const userSocket = new net.Socket();

async function connectToServer(user, ipadress) {
    console.log('Client: Attempting to connect server on adress: ' + ipadress)    

    //createConnection
   
    userSocket.connect(port, ipadress, function(){
        console.log(`Client: Connecting on port: ${port}`);
        userSocket.write(".setInitUserName " + user + ' ' +ipadress);  
       

        rl.on('line', (line) => {
            if (line === '.quit') {
                userSocket.destroy();                
            } else if (line === '.help') {
                console.log('Help: \nCOMMANDS:'
                +'\n\ntype ".quit" to close connection to server and quit application.')
            } else {
            userSocket.write(line);
            }
        })
        
    });
}


const start = async () => {  
    let username = await rl.question('What is your name?: ')

    let ipadress = await rl.question('Server adress: (ex 127.0.0.1): ')
    switch (username) {
        case undefined: 
            console.log('Undefined input!')
            connectToServer('user' + Math.floor(Math.random() * 100), ipadress)
            break;
        case ('' || ' '): 
        console.log('Empty input!')
            connectToServer('user' + Math.floor(Math.random() * 100), ipadress)
            break;
        default: 
            console.log('default input!')
            connectToServer(username, ipadress)
    }

    console.log('Efter switch för namn och ipadress!')   
}


start();

userSocket.on('data', function(data){
    console.log(`> ${data}`);
});

userSocket.on('destroy', function(){
    console.log('User ended session!')
    rl.close();
})

userSocket.on('close', function(){
    console.log(`Client closed connection to server!`);
    rl.close();
});

userSocket.on('error', function(error){
    console.log(`Client connection error: ${error}`);
    rl.close();
});