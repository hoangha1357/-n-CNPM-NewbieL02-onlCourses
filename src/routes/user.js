const express = require('express');
const passport = require('passport');
const route = express.Router();

const UserController = require('../app/controllers/UserController');
const authenticateUser = require('../app/middlewares/Authenticate');
const requireLogin = require('../app/middlewares/LoginRequires');

// route.get('/stored/ordered', UserController.ordered);
route.get('/viewrevenue',requireLogin ,UserController.viewrevenue);
route.get('/trash', requireLogin ,UserController.trash);
route.post('/register',requireLogin , UserController.register);
route.post('/login', UserController.login,authenticateUser);
route.get('/logout', UserController.logout);

module.exports = route;
