const express = require('express');
const route = express.Router();

const CourseController = require('../app/controllers/CoursesController');
const authenticateUser = require('../app/middlewares/Authenticate');
const requireLogin = require('../app/middlewares/LoginRequires');

// route.get('/stored/ordered', UserController.ordered);
route.get('/');


module.exports = route;
