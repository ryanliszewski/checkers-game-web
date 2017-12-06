
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
      console.log('Room Name: ', params.room);
      console.log('Game Socket ID: ', socket.id);

      socket.join(params.room);

      socket.on(params.room, function(msg){
        console.log('TEST: ', params.room);
        console.log('TEST MESSAGE: ', msg);
        nsp.emit(params.room, msg);
      });

      callback();
    });

    socket.on('disconnect', function(){
      console.log('User Disconnected (Server Side - Game Room)');
    });

  });

};
