const express = require('express');
const BlogController = require('../Controllers/BlogController');
const AuthController = require('../Controllers/AuthControllers');

const route = express.Router();

route.get('/', BlogController.getAllBlog);
route.get('/getOneBlog/:id', BlogController.getOneBlog);
// route.use(AuthController.isLoggedIn);
route.post('/', BlogController.createBlog);
route.patch('/updateBlog/:id', BlogController.updateBlog);
route.delete('/deleteBlog/:id', BlogController.deleteBlog);

module.exports = route;