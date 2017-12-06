
var db = require('../models');

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

  var gameArray = ['cat', 'dog'];

  io.on('connection', function(socket) {
    console.log('User Connected (Server Side - Lobby Chat): ', socket.id);
    socket.on('lobbyChat', function(msg){
      io.emit('lobbyChat', msg);
    });

    socket.on('disconnect', function(){
      console.log('User Disconnected (Server Side - Lobby Chat)');
    });

  });

  var nsp = io.of('/game');

  nsp.on('connection', function(socket) {
    console.log('User Connected (Server Side - Game Room): ', socket.id);

    // socket.on('gameChat', function(msg){
    //   nsp.emit('gameChat', msg);
    // });


    socket.on('join', (params, callback) => {
      console.log('Game Player Name: ' , params.name);
      console.log('Game ID: ', params.gameID);
      console.log('Game Socket ID: ', socket.id);

      socket.join(params.gameID);

      newGameList = new db.gameList({
          gameId: params.gameID
      });

      newGameList.save((err) => {
          if (err) {
              return response.send(err);
          } else {

          }
      });
      // db.gameLists.create({ gameId: params.gameID})
      // .catch(error => {
      //   console.log(error);
      // })
      // db.gameLists.any(`INSERT INTO gameLists ("gameId") VALUES ('${params.room}')`)
      //     .catch( error => {
      //         console.log( error );
      //         response.json({ error })
      //     })

      socket.on(params.gameID, function(msg){
        console.log('TEST: ', params.gameID);
        console.log('TEST MESSAGE: ', msg);
        nsp.emit(params.gameID, msg);
      });

      callback();
    });

    socket.on('disconnect', function(){
      console.log('User Disconnected (Server Side - Game Room)');
    });

  });

};
