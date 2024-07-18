const express = require('express');
const AppointmentController = require('../Controllers/AppointmentController');
const authController = require('../Controllers/AuthControllers');
route = express.Router();

route.post('/', AppointmentController.createAppointment);
route.get('/getAllTime/:date', AppointmentController.filterTime);
route.use(authController.isLoggedIn);
route.get('/:paginate', AppointmentController.getAllAppointment);
route.patch('/updateAcceptance/:id', AppointmentController.updateAppointmentAcceptance);
route.get('/search/:name/:paginate', AppointmentController.searchAppointment);
route.get('/filter/:date/:paginate', AppointmentController.filterAppointment);
route.delete('/deleteAppointment/:id', AppointmentController.deleteAppointment);

module.exports = route;