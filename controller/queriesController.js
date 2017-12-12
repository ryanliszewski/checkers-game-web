const queries = require('../db/queries');

module.exports.ActiveGameList = () => {
  queries.dbActiveGameList()
  .then(results => { 
    console.log("IM HERE: ", results)
  })
  .catch( err => {
    console.log('Error occured during inserting to DB: ', err)
  })
}