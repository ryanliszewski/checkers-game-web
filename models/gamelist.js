'use strict';
module.exports = (sequelize, DataTypes) => {
  var gameList = sequelize.define('gameList', {
    gameId: DataTypes.STRING,
    isGameFull: DataTypes.BOOLEAN,
    gameCreator: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return gameList;
};
