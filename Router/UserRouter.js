const express = require('express');
const authController = require('../Controllers/AuthControllers');

const route = express.Router();

route.post('/login', authController.login);
route.get('/logout', authController.logout);
// route.use(authController.isLoggedIn);
route.post('/', authController.signUp);
route.post('/register', authController.register);
route.get('/getUser/:token', authController.getUser);

module.exports = route;