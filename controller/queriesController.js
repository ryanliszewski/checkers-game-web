const queries = require('../db/queries');


module.exports.ActiveGameList = () => {
  return queries.dbGameList()
  .then(data => { 
    // console.log("IM HERE: ", data)
    return JSON.stringify(data)
  })  
  .catch( err => {
    console.log(err)
  })
}

module.exports.GetMessages = () => {
  return queries.dbGetMessages()
  .then(data => { 
    // console.log("Im here from queriesController: ", data)
    return data;
  })
  .catch( err => {
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
    // console.log("parse data: ", data[0]['isGameFull']);
    results =  data[0]['isGameFull'];
    return results;
  })
  .catch( err => {
    console.log(err)
  })
}



// var temp = JSON.stringify(results);
// var data = JSON.parse("[" + temp + "]");
// // console.log("parse data: ", data[0]['isGameFull']);
// isFull = data[0]['isGameFull'];