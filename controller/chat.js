const gameList = require('../models').gameList;
const lobbyChat = require('../models').lobbyChat;
const sequelize = require('sequelize');
const queriesController = require('../controller/queriesController')

const queries = require('../db/queries');

// function dbCreateGame(params) {
//   gameList.findOrCreate({
//       where: {
//         gameId: params.gameID,
//         gameCreator: params.name
//       }
//     })
//     .then(results => {})
//     .catch(err => {
//       console.log(err)
//     })
// }


module.exports = function(io) {

  io.on('connection', function(socket) {
    console.log('User Connected (Server Side - Lobby Chat): ', socket.id);

    queriesController.GetMessages().then( data => {
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

  });

  var nsp = io.of('/game');

  nsp.on('connection', function(socket) {
    console.log('User Connected to Game Room (Server Side): ', socket.id);
    socket.on('join', (params, callback) => {

      socket.join(params.gameID, () => {
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

      socket.broadcast.to(params.gameID).emit(params.gameID, `Player ${params.name} has joined.`);
      socket.broadcast.to(params.gameID).emit(params.gameID, `Player YOUR TURN!`);
      socket.on(params.gameID, function(msg) {
        nsp.emit(params.gameID, msg);
      });
      socket.on('gameStatus', function(gameID) {
        console.log("gameStatus gameID: ", gameID); // FIX THIS NOT GETTING GAME ID SO THEREFORE GAMESTATUS IS NULL

        queriesController.GetGameStatus(gameID).then( isFull => {
          console.log("gameStatus send: ", isFull);
          nsp.emit('gameStatus', isFull);
        })
        .catch(err => {
          console.log(err)
        })

        // console.log("gameStatus send: ", isFull);
        // nsp.emit('gameStatus', isFull);
        // socket.broadcast.emit('gameStatus', true);
      });

      socket.on('gameMove', function(move) {
        //console.log("BACKEND MOVE: ", move);
        nsp.emit('gameMove', move);
        socket.broadcast.to(params.gameID).emit(params.gameID, `Player YOUR TURN!`);
      });

      // socket.on('leave', function() {
      //   console.log("LEAVE MESSAGE");
      //     socket.leave(() => {
      //       console.log("WITHIN LEAVE FUNCTION");
      //       queriesController.ActiveGameList().then(results => {
      //         return io.of('/').emit('gameListActive', JSON.stringify(results));
      //       })
      //       console.log("Leaiving leave function");
      //     });
      // });

      socket.on('disconnect', function() {
        console.log('User Disconnected GAME (Server Side)');
        socket.broadcast.to(params.gameID).emit(params.gameID, `Player has LEFT GAME!`);
        queries.dbDestroyGame(params).then(data => {
          return queriesController.ActiveGameList().then(results => {
            return io.of('/').emit('gameListActive', JSON.stringify(results));
          })
        })
      });

      callback();
    }); // End of JOIN Channel

  }); // NSP Connection

}; // Export
