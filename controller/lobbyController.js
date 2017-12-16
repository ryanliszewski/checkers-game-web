const queriesController = require('../controller/queriesController')
const queries = require('../db/queries');

module.exports = function(io) {

  io.on('connection', function(socket) {
    console.log('User Connected (Server Side - Lobby Chat): ', socket.id);
    console.log("===============================================");
    console.log(Object.keys(io.sockets.sockets));

    queriesController.GetMessages().then(data => {
      for (let i = data.length - 1; i >= 0; i--) {
        io.to(socket.id).emit('lobbyChat', data[i]['dataValues']['username'] + ": " + data[i]['dataValues']['message']);
      }
    })

    socket.on('lobbyChat', function(msgObj) {
      queries.dbCreateMessage(msgObj);
      io.emit('lobbyChat', msgObj.username + ": " + msgObj.message);
    });

    socket.on('gameListActive', function functionName(msg) {
      console.log("gameListActive CALLED:", msg);
      queriesController.ActiveGameList().then(results => {
        socket.emit('gameListActive', JSON.stringify(results));
      })
    })

    socket.on('disconnect', function() {
      console.log('User Disconnected (Server Side - Lobby Chat)');
    });

  }); // End of Lobby page Connection

}