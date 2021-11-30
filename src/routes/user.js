const express = require('express');
const passport = require('passport');
const route = express.Router();

const UserController = require('../app/controllers/UserController');
const authenticateUser = require('../app/middlewares/Authenticate');
const requireLogin = require('../app/middlewares/LoginRequires');

route.get('/registerCourse/:id', requireLogin, UserController.registerCourse);
route.get('/registered-course', requireLogin, UserController.viewRegisteredCourse);
route.get('/resetpassword/:id/:token', UserController.resetPassword);
route.put('/updatepassword/:id/:token', UserController.updatePassword);

route.post('/writecomment/:courseid', requireLogin, UserController.writeComment);
route.post('/answercomment/:commentid', requireLogin, UserController.answerComment);
route.get('/update_info', requireLogin, UserController.view_update_info);
route.put('/update_info', requireLogin, UserController.submit_update_info);
route.get('/change_pass', requireLogin, UserController.view_change_pass);
route.put('/change_pass', requireLogin, UserController.submit_change_pass);

route.post('/register', UserController.register);
route.post('/login', UserController.login,authenticateUser);
route.get('/logout', UserController.logout);
route.get('/', UserController.index);


module.exports = route;
