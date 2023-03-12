const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });
const clients = new Set();

var Games = {1:[null,null]};
function GameToJoin(){
  //if the current index we are checking null we have to add empty array to hold player states
  if(Games[ Object.keys(Games).length]==null){
    Games[ Object.keys(Games).length] = [null,null];
  }
//if the second value in a game of two is not null aka its taken and filled with a players map then add another slot for the 2 next two
if (Games[ Object.keys(Games).length][0] ==null ){
  return {
    MYUSERID:1,
    gameID:  Object.keys(Games).length  ,
  }
}
  if (Games[ Object.keys(Games).length][1] !=null ){
    Games[ Object.keys(Games).length+1] = [null,null];
    return {
      MYUSERID:1,
      gameID:  Object.keys(Games).length  ,
    }
  }else{
    return {
      MYUSERID:2,
      gameID:  Object.keys(Games).length   ,
    }
  }
}
server.on('connection', (socket) => {
  console.log('Client connected');
  clients.add(socket);

  //console.log(socket);
  socket.on('message', (message) => {
    console.log("messaged recieved");
    const data = JSON.parse(message);
    if (data.type=="Matching"){
      const message = {
        type: 'Matching',
        data: GameToJoin(),
      };
      //console.log(message);
      socket.send(JSON.stringify(message));

      //broadcast to other clients
      for (const client of clients) {
        if (( client != socket) && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      }

    }
    //Messages for Updating Boards when moves are played
    if (data.type=="update"){
    const userId = data.data.userId;
    const gameID = data.data.gameID;
   console.log(userId,gameID,Games[gameID]);
    Games[gameID][userId-1] = data.data.letters;



    //console.log(Games);
    // Broadcast the message to all connected clients
    for (const client of clients) {
      //console.log(client.readyState === WebSocket.OPEN);
      //console.log((client === socket || client != socket));
      if (( client != socket) && client.readyState === WebSocket.OPEN) {
        //console.log("updating client send" ,userId);
        const message = {
          type: 'update',
          data: {
            userId: userId,
            letters: Games[gameID][userId-1],
            moves:data.data.moves,
            gameID:gameID,
          }
        };
        //console.log("sending , ",message);
        client.send(JSON.stringify(message));
      }
    }
}




  });
  

  socket.on('close', () => {
    clients.delete(socket);
    console.log('Client disconnected');
  });
});

console.log('WebSocket server running on port 8080');
