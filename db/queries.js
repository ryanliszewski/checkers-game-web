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
        chatChannel: params.chatChannel,
        moveChannel: params.moveChannel,
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
        chatChannel: params.chatChannel
      }
    })
    .catch(err => {
      console.log(err)
    })
}

const dbGameFull = (params) => {
  return gameList.update({
      isGameFull: 'true'
    }, {
      where: {
        chatChannel: params.chatChannel
      }
    })
    .catch(err => {
      console.log(err)
    })
}

const dbGameList = () => {
  return gameList.findAll({
      where: {
        isGameFull: 'false'
      },
      attributes: ['chatChannel', 'moveChannel','isGameFull', 'gameCreator']
    }).then(rawData => {
      return rawData;
    })
    .catch(err => {
      console.log(err)
    });
}

const dbGetMessages = () => {
  return lobbyChat.findAll({
      order: [
        ['id', 'DESC']
      ],
      limit: 25
    }).then(data => {
      return data;
    })
    .catch(err => {
      console.log(err)
    });
}

const dbGameStatus = (moveChannel) => {
  return gameList.findOne({
    where: {
      moveChannel: moveChannel,
      isGameFull: true
    }
  }).then(rawData => {
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
