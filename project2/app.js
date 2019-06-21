const express = require('express');
const app = module.exports = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
 // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

require('./routes');

const driver = require('./neo4j');

app.listen(3001, function() {
    console.log("Application is started");
    console.log("Lisiting on the port 3001");
});

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, exitCode) {
    if (options.cleanup) {
        console.log('we are cleaning up before the exit');
    }
    if (exitCode || exitCode === 0) {
        console.log("we are exiting with code", exitCode);
    }
    if (options.exit) {
        console.log("closing the database connections");
        driver.close();
        console.log("connections closed");
        process.exit();
    }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));