const queriesController = require('../controller/queriesController')
const queries = require('../db/queries');

module.exports = function(io) {

const nsp = io.of('/game');

  nsp.on('connection', function(socket) {
    console.log('User Connected to Game Room (Server Side): ', socket.id);
    socket.on('join', (params, callback) => {

      socket.join(params.chatChannel, () => {
        if (params.isGameFull == 'true') {
          queries.dbGameFull(params).then(data => {
            return queriesController.ActiveGameList().then(results => {
              return io.of('/').emit('gameListActive', JSON.stringify(results));
            })
          })
        } else {
          queries.dbCreateGame(params).then(data => {
            return queriesController.ActiveGameList().then(results => {
              return io.of('/').emit('gameListActive', JSON.stringify(results));
            })
          })
        }
      }); // End of Socket Join

      socket.broadcast.to(params.chatChannel).emit(params.chatChannel, `${params.name} has joined.`);
      socket.broadcast.to(params.chatChannel).emit(params.chatChannel, `Your Turn`);
      socket.on(params.chatChannel, function(msg) {
        if(msg == 'draw') {
          socket.broadcast.to(params.chatChannel).emit(params.chatChannel, 'draw');
        } else {
          nsp.emit(params.chatChannel, msg);
        }
      });

      socket.on('gameStatus', function(chatChannel) {
        console.log("gameStatus chatChannel: ", chatChannel);

        queriesController.GetGameStatus(chatChannel).then(isFull => {
            console.log("gameStatus send: ", isFull);
            nsp.emit('gameStatus', isFull);
          })
          .catch(err => {
            console.log(err)
          })
      });

      socket.on('gameMove', function(move) {
        console.log("Chat Channel:", params.chatChannel);
        console.log("Move Channel: ", params.moveChannel);
        nsp.emit(params.moveChannel, move);
        socket.broadcast.to(params.chatChannel).emit(params.chatChannel, `Your Turn`);
      });

      socket.on('disconnect', function() {
        console.log('User Disconnected GAME (Server Side)');
        socket.broadcast.to(params.chatChannel).emit(params.chatChannel, `Player has LEFT GAME!`);
        queries.dbDestroyGame(params).then(data => {
          return queriesController.ActiveGameList().then(results => {
            return io.of('/').emit('gameListActive', JSON.stringify(results));
          })
        })
      });

      callback();
    }); // End of JOIN Channel

  }); // NSP Connection

}
