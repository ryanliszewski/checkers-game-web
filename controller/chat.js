
const gameList = require('../models').gameList;

module.exports = function (io) {

  /**
   * Chat console message.
   */
  // io.on('connection', function(socket){
  //   socket.on('game chat', function(msg){
  //     io.emit('game chat', msg);
  //   });
  // });

  // io.on('connection', function(socket){
  //   socket.on('chat message', function(msg){
  //     io.emit('chat message', msg);
  //   });
  // });

  var gameArray;

  io.on('connection', function (socket) {
    console.log('User Connected (Server Side - Lobby Chat): ', socket.id);
    socket.on('lobbyChat', function (msg) {
      io.emit('lobbyChat', msg);
    });

    gameList.findAll({attributes: ['gameId']})
      .then(results => {
        // console.log('Game IDs: ', JSON.stringify(results))
        gameArray = JSON.stringify(results);
      })
      .catch(err => {
        console.log(err)
      });

      socket.emit('gameListActive', JSON.stringify(gameArray));
      // io.emit('', JSON.stringify(gameArray));
    // socket.on('gameListActive', function (gameArray) {
    //   console.log("Sending data to gameListActive channel");
    //
    // });

    socket.on('disconnect', function () {
      console.log('User Disconnected (Server Side - Lobby Chat)');
    });

  });

  var nsp = io.of('/game');
  nsp.on('connection', function (socket) {
    console.log('User Connected (Server Side - Game Room): ', socket.id);

    // socket.on('gameChat', function(msg){
    //   nsp.emit('gameChat', msg);
    // });


    socket.on('join', (params, callback) => {
      console.log('Game Player Name: ', params.name);
      console.log('Game ID: ', params.gameID);
      console.log('Game Socket ID: ', socket.id);

      socket.join(params.gameID, () => {

        gameList.create({ gameId: params.gameID })
          .then(results => {
            // console.log('TESTING FOR GAME LIST IDs', JSON.stringify(results))
          })
          .catch(err => {
            console.log(err)
          })
      });

      // nsp.connected( {
      //   (clients) => {
      //     console.log(clients[0]);
      //   }
      // });
      // console.log("=====");
      // console.log("Users List: ", nsp.connected);
      // console.log("=====");

      socket.broadcast.to(params.gameID).emit(params.gameID, `Player ${params.name} has joined.`);
      socket.on(params.gameID, function (msg) {
        console.log('TEST: ', params.gameID);
        console.log('TEST MESSAGE: ', msg);
        nsp.emit(params.gameID, msg);
      });


      /*
            socket.leave(params.gameID, () => {
              gameList.destroy({ where: { gameId: params.gameID } })
                .then(results => {
                  console.log('UDATED GAME LIST AFTER LEAVING ROOM:', JSON.stringify(results))
                })
                .catch(err => {
                  console.log(err)
                })
            })
      */
      callback();
    });

    socket.on('disconnect', function () {
      // socket.on('leave', (params, callback) => {
      //   socket.broadcast.to(params.gameID).emit(params.gameID, `Player ${params.name} has left game.`);
      //   console.log('User LEFT Game (Server Side)');
      // });
    }); // NSP Disconnected

  }); // NSP Connection

}; // Export
