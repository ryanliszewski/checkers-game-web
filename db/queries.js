const gameList = require('../models').gameList;
const lobbyChat = require('../models').lobbyChat;
const sequelize = require('sequelize');

const dbCreateMessage = (msgObj) => {
  lobbyChat.create({
      username: msgObj.username,
      message: msgObj.message
    })
    .catch(err => {
      console.log(err);
    })
}

const dbCreateGame = (params) => {
  return gameList.findOrCreate({
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
  return gameList.destroy({
      where: {
        isGameFull: 'false',
        gameId: params.gameID
      }
    })
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

const dbGameList = () => {
    return gameList.findAll({
      where: {isGameFull: 'false'},
      attributes: ['gameId', 'isGameFull', 'gameCreator']
  }).then( rawData => {
    return rawData;
  })
  .catch(err => {
    console.log(err)
  });
}

const dbGetMessages = () => {
  return lobbyChat.findAll({
    order: [ ['id', 'DESC']],
    limit: 25
  }).then(data => {
    // console.log("RAW QUERY: ", data)
    return data;
  })
  .catch(err => {
    console.log(err)
  });
}

const dbGameStatus = (gameID) => {
  return gameList.findOne({
    where: {
      gameId: gameID,
      isGameFull: true
    }
  }).then(rawData => {
    console.log("RAW QUERY: ", rawData)
    return rawData;
  }).catch(err => {
    console.log(err)
  })
}

module.exports = {
  dbCreateGame,
  dbCreateMessage,
  dbDestroyGame,
  dbGameFull,
  dbGameList,
  dbGameStatus,
  dbGetMessages
}
