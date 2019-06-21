var app = require('../app');
var controller = require('../controllers/index');

app.get('/', controller.helloworld);

app.post('/api/crank', controller.createRank);

app.post('/api/cstudent', controller.createPerson);

app.post('/api/cinventory', controller.createInventory);

app.post('/api/cclass', controller.createClass);

app.post('/api/cfee', controller.createFee);

app.post('/api/arank', controller.awardRank);

app.get('/api/gstudents', controller.getStudents);

app.get('/api/ginventory', controller.getInventory);

app.get('/api/gfee', controller.getFeeDetails);

app.get('/api/gclass', controller.getClassDetails);

app.get('/api/sfeedetails', controller.getStudentFee);

app.get('/api/sranks', controller.getRanks);

app.get('/api/getcstudents', controller.getClassStudents);

app.post('/api/cattandance', controller.createAttendance);

app.get('/api/gsattendance', controller.getStudentAtt);

app.post('/api/makeinactive', controller.makeInactive);