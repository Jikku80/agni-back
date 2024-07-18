const express = require('express');

const PatientController = require('../Controllers/PatientControllers');
const AuthController = require('../Controllers/AuthControllers');

const route = express.Router();

route.use(AuthController.isLoggedIn);
route.get('/getAll/:paginate', PatientController.getAllPatient);
route.post('/', PatientController.createPatient);
route.get('/byPhone/:phone', PatientController.getPatientByPhone);
route.get('/getOnePatient/:id', PatientController.getOnePatient);
route.patch('/updatePatient/:id', PatientController.updatePatient);
route.delete('/deletePatient/:id', PatientController.deletePatient);
route.get('/search/:name/:paginate', PatientController.searchPatient);

module.exports = route;