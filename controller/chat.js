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

  // var gameArray;
  // var isFull;

  io.on('connection', function(socket) {
    console.log('User Connected (Server Side - Lobby Chat): ', socket.id);

    queriesController.GetMessages().then( data => {
      for (let i = data.length - 1; i >= 0; i--) {
        io.to(socket.id).emit('lobbyChat', data[i]['dataValues']['username'] + ": " + data[i]['dataValues']['message']);
      }
    })
    // lobbyChat.findAll({
    //   order: [
    //     ['id', 'DESC']
    //   ],
    //   limit: 25
    // }).then(results => {
    //   for (let i = results.length - 1; i >= 0; i--) {
    //     io.to(socket.id).emit('lobbyChat', results[i]['dataValues']['username'] + ": " + results[i]['dataValues']['message']);
    //   }
    // })

    socket.on('lobbyChat', function(msgObj) {
      queries.dbCreateMessage(msgObj);
      io.emit('lobbyChat', msgObj.username + ": " + msgObj.message);
    });

    queriesController.ActiveGameList().then(results => {
      console.log("dbGameList: ", results )
      socket.emit('gameListActive', JSON.stringify(results));
    })
    // console.log("dbGameStatus: ", dbGameStatus )
    // dbGameStatus.then(results => {
    //   console.log("dbGameStatus: ", results )
      
    // })
    
    // gameList.findAll({
    //     attributes: ['gameId', 'isGameFull', 'gameCreator']
    //   })
    //   .then(results => {
    //     gameArray = JSON.stringify(results);
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   });

    // socket.emit('gameListActive', JSON.stringify(gameArray));

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
          queries.dbGameFull(params)
        } else {
          queries.dbCreateGame(params);
        }
      }); // End of Socket Join

      socket.broadcast.to(params.gameID).emit(params.gameID, `Player ${params.name} has joined.`);
      socket.broadcast.to(params.gameID).emit(params.gameID, `Player YOUR TURN!`);
      socket.on(params.gameID, function(msg) {
        nsp.emit(params.gameID, msg);
      });
      socket.on('gameStatus', function(gameID) {

        // gameList.findOne({
        //     where: {
        //       gameId: gameID,
        //       isGameFull: true
        //     }
        //   }).then(results => {
        //     var temp = JSON.stringify(results);
        //     var data = JSON.parse("[" + temp + "]");
        //     // console.log("parse data: ", data[0]['isGameFull']);
        //     isFull = data[0]['isGameFull'];
        //   }).catch(err => {
        //     console.log(err)
        //   })

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
        console.log("BACKEND MOVE: ", move);
        nsp.emit('gameMove', move);
        socket.broadcast.to(params.gameID).emit(params.gameID, `Player YOUR TURN!`);
      });

      socket.on('disconnect', function() {
        console.log('User Disconnected GAME (Server Side)');
        socket.broadcast.to(params.gameID).emit(params.gameID, `Player has LEFT GAME!`);
        queries.dbDestroyGame(params);
      });

      callback();
    }); // End of JOIN Channel

  }); // NSP Connection

}; // Export
