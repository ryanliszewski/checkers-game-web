'use strict';
module.exports = (sequelize, DataTypes) => {
  var gameList = sequelize.define('gameList', {
    chatChannel: DataTypes.STRING,
    moveChannel: DataTypes.STRING,
    isGameFull: { type: DataTypes.BOOLEAN, defaultValue: false },
    gameCreator: DataTypes.STRING,
    opponent: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return gameList;
};
