const gameList = require('../models').gameList;
const lobbyChat = require('../models').lobbyChat;
const sequelize = require('sequelize');
function dbCreateMessage(msgObj) {
  lobbyChat.create({
        username: msgObj.username,
        message: msgObj.message
    })
    .then(results => {})
    .catch(err => {
      console.log("WHAT MY ERROF:", err);
    })
}

function dbCreateGame(params) {
  gameList.findOrCreate({
      where: {
        gameId: params.gameID,
        gameCreator: params.name,
        isGameFull: params.isGameFull
      }
    })
    .then(results => {})
    .catch(err => {
      console.log(err)
    })
}

function dbDestroyGame(params) {
  gameList.destroy({
      where: {
        gameId: params.gameID
      }
    })
    .then(results => {})
    .catch(err => {
      console.log(err)
    })
}

module.exports = function(io) {

  var gameArray;

  io.on('connection', function(socket) {
    console.log('User Connected (Server Side - Lobby Chat): ', socket.id);

    lobbyChat.findAll({ order: [['id', 'DESC']], limit:10}).then(results => {
      for(let i = results.length - 1; i >= 0; i--) {
        io.to(socket.id).emit('lobbyChat', results[i]['dataValues']['username'] + ": " + results[i]['dataValues']['message']);
      }
    })

    socket.on('lobbyChat', function(msgObj) {
      dbCreateMessage(msgObj);
      io.emit('lobbyChat', msgObj.username + ": " + msgObj.message);
    });

    gameList.findAll({
        attributes: ['gameId', 'isGameFull', 'gameCreator']
      })
      .then(results => {
        gameArray = JSON.stringify(results);
      })
      .catch(err => {
        console.log(err)
      });

    socket.emit('gameListActive', JSON.stringify(gameArray));

    socket.on('disconnect', function() {
      console.log('User Disconnected (Server Side - Lobby Chat)');
    });

  });

  var nsp = io.of('/game');
  nsp.on('connection', function(socket) {
    console.log('User Connected to Game Room (Server Side): ', socket.id);
    socket.on('join', (params, callback) => {

      socket.join(params.gameID, () => {
        if (params.isGameFull == 'false') {
          dbCreateGame(params);
        } else {
          dbDestroyGame(params);
          dbCreateGame(params);
        }
      });

      socket.broadcast.to(params.gameID).emit(params.gameID, `Player ${params.name} has joined.`);
      socket.on(params.gameID, function(msg) {
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

    socket.on('disconnect', function() {
      // socket.on('leave', (params, callback) => {
      //   socket.broadcast.to(params.gameID).emit(params.gameID, `Player ${params.name} has left game.`);
      //   console.log('User LEFT Game (Server Side)');
      // });
    }); // NSP Disconnected

  }); // NSP Connection

}; // Export
