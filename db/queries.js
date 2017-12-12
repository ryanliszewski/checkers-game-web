const gameList = require('../models').gameList;
const lobbyChat = require('../models').lobbyChat;
const sequelize = require('sequelize');

const dbCreateMessage = (msgObj) => {
  lobbyChat.create({
      username: msgObj.username,
      message: msgObj.message
    })
    .then(results => {})
    .catch(err => {
      console.log("WHAT MY ERROF:", err);
    })
}

const dbCreateGame = (params) => {
  gameList.findOrCreate({
      where: {
        gameId: params.gameID,
        gameCreator: params.name
      }
    })
    .then(results => {})
    .catch(err => {
      console.log(err)
    })
}

const dbDestroyGame = (params) => {
  gameList.destroy({
      where: {
        isGameFull: 'false',
        gameId: params.gameID
      }
    })
    .then(results => {})
    .catch(err => {
      console.log(err)
    })
}

const dbGameFull = (params) => {
  gameList.update({
      isGameFull: 'true'
    }, {
      where: {
        gameId: params.gameID
      }
    })
    .catch(err => {
      console.log(err)
    })
}

module.exports = {
  dbCreateGame,
  dbCreateMessage,
  dbDestroyGame,
  dbGameFull
}