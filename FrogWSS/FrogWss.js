const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });
const clients = new Set();

var Games = {};

server.on('connection', (socket) => {
  console.log('Client connected');
  clients.add(socket);

  //console.log(socket);
  socket.on('message', (message) => {
    console.log("messaged recieved");
    const data = JSON.parse(message);
    const userId = data.data.userId;
    const messageText = data.data.message;
    Games[userId] = data.data.letters;

    // Broadcast the message to all connected clients
    for (const client of clients) {
      console.log(client.readyState === WebSocket.OPEN);
      console.log((client === socket || client != socket));
      if (( client != socket) && client.readyState === WebSocket.OPEN) {
        console.log("updating client send" ,userId);
        const message = {
          type: 'update',
          data: {
            userId: userId,
            letters: Games[userId],
            moves:data.data.moves,
          }
        };
        
        client.send(JSON.stringify(message));
      }
    }






  });
  

  socket.on('close', () => {
    clients.delete(socket);
    console.log('Client disconnected');
  });
});

console.log('WebSocket server running on port 8080');
