const express = require('express')
const app = module.exports = express()

require('./routes')

 
app.listen(3000, function() {
    console.log("Application is started")
    console.log("Lisiting on the port 3000")
})