const net = require('net');

const connectedClients = [];

const server = net.createServer(onClientConnection);

server.listen({
    //host: '127.0.0.1', 
    port: 8080
}, console.log('Server is up, listening to port 8080'));

function onClientConnection(socket) {
    socket.username = 'user'+Math.floor(Math.random() * 1000);

    connectedClients.push(socket);
    console.log(`${socket.remoteAddress}: ${socket.remotePort} : ${socket.username} connected to server.`);

    socket.write('## Welcome to the chatserver ##\ntype .help for more commands');
    
    socket.on('data', function(data){
        
        olduser = socket.username;
        let message = data;
        const messageArray = message.toString().split(' ');
        if (messageArray[0] === ".setInitUserName") {
            socket.username = messageArray[1];
            socket.adress = messageArray[2];
            console.log(`${olduser} is now known as ${socket.username} connected to ${socket.adress}`)
            sendServerMessage(`${socket.username} joined the chat!`)
        }  else {
            sendUserMessage(message);
        }        
    });

    function sendUserMessage(message) {
        console.log(`${socket.username} on ${socket.adress} sent message: ${message}`);
        connectedClients.forEach(clientSocket => {
            if (clientSocket.username != socket.username && clientSocket.adress === socket.adress) {
                
                clientSocket.write(socket.username + ': ' + message);
            }
        })
    }

    function sendServerMessage(message) {
        connectedClients.forEach(clientSocket => {
            if (clientSocket.adress === socket.adress) {
                clientSocket.write(message);
            }
        })
    }

    socket.on('close', function(){
        sendServerMessage(`${socket.username} left the chat..`);
        console.log(socket.username + ` closed connection to server`);        
    });

    socket.on('error', function(error){
        console.error(`${socket.remoteAddress}: ${socket.remotePort} Error ${error}`);
    });
    
};

