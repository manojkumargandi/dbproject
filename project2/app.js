const express = require('express')
const app = module.exports = express()
const bodyParser = require('body-parser')


 // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

require('./routes')

app.listen(3001, function() {
    console.log("Application is started")
    console.log("Lisiting on the port 3001")
});