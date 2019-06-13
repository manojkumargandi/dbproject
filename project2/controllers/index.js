const db = require('../neo4j')

exports.helloworld = function (req, res) {
    console.log(db)
    res.send('hello world')
}