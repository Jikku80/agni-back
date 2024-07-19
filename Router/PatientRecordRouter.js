const express = require('express');

const PatientRecordController = require('../Controllers/PatientRecordControllers');
const AuthController = require('../Controllers/AuthControllers');

const route = express.Router();

// route.use(AuthController.isLoggedIn);
route.get('/', PatientRecordController.getAllPatientRecord);
route.post('/createRecord/:id', PatientRecordController.createPatientRecord);
route.get('/getOnePatientRecords/:id', PatientRecordController.getOnePatientRecord);
route.patch('/updateRecord/:id/:phone', PatientRecordController.updatePatientRecord);
route.delete('/deleteRecord/:id/:phone', PatientRecordController.deletePatientRecord);

module.exports = route;