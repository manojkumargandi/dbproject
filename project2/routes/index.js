var app = require('../app')
var controller = require('../controllers/index')

app.get('/', controller.helloworld)

app.post('/crank', controller.createRank)