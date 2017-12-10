'use strict';
module.exports = (sequelize, DataTypes) => {
  var gameList = sequelize.define('gameList', {
    gameId: DataTypes.STRING,
    isGameFull: { type: DataTypes.BOOLEAN, defaultValue: false },
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
