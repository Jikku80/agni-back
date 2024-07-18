const express = require('express');
const PatientSubRecordController = require('../Controllers/PatientSubRecordControllers');
const AuthController = require('../Controllers/AuthControllers');

const route = express.Router();

route.use(AuthController.isLoggedIn);
route.post('/create-sub-record/:id', PatientSubRecordController.createPatientRecord);
route.get('/getOnePatientSubRecord/:id', PatientSubRecordController.getOnePatientSubRecord);
route.patch('/update/:id/:patientRecord', PatientSubRecordController.updateSubRecord);
route.delete('/delete/:id/:patientRecord', PatientSubRecordController.deleteSubRecord);

module.exports = route;