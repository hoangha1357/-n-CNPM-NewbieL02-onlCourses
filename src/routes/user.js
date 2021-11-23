const express = require('express');
const passport = require('passport');
const route = express.Router();

const UserController = require('../app/controllers/UserController');
const authenticateUser = require('../app/middlewares/Authenticate');
const requireLogin = require('../app/middlewares/LoginRequires');

route.get('/registered-course', requireLogin, UserController.registeredCourse);
route.get('/resetpassword/:id/:token', UserController.resetPassword);
route.put('/updatepassword/:id/:token', UserController.updatePassword);
route.post('/register', UserController.register);
route.post('/login', UserController.login,authenticateUser);
route.get('/logout', UserController.logout);

route.get('/', UserController.index);
route.get('/update_info', UserController.view_update_info);
route.put('/update_info', UserController.submit_update_info);
route.get('/change_pass', UserController.view_change_pass);
route.put('/change_pass', UserController.submit_change_pass);

module.exports = route;
