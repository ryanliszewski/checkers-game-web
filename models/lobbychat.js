'use strict';
module.exports = (sequelize, DataTypes) => {
  var lobbyChat = sequelize.define('lobbyChat', {
    username: DataTypes.STRING,
    message: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  },);
  return lobbyChat;
};
