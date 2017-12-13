const queries = require('../db/queries');


module.exports.ActiveGameList = () => {
  return queries.dbGameList()
    .then(queryData => {
      return JSON.stringify(queryData)
    })
    .catch(err => {
      console.log(err)
    })
}

module.exports.GetMessages = () => {
  return queries.dbGetMessages()
    .then(data => {
      return data;
    })
    .catch(err => {
      console.log(err)
    })
}

module.exports.GetGameStatus = (gameId) => {
  return queries.dbGameStatus(gameId)
    .then(queryData => {
      let results;
      console.log("Im here from queriesController: ", queryData)
      let temp = JSON.stringify(queryData);
      let data = JSON.parse("[" + temp + "]");
      results = data[0]['isGameFull'];
      return results;
    })
    .catch(err => {
      console.log(err)
    })
}
