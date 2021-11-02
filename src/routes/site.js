const express = require('express');
const route = express.Router();

const site_controller = require('../app/controllers/SiteController');

route.get('/search', site_controller.search);
route.get('/booktable', site_controller.booktable);
route.get('/loginpage', site_controller.loginpage);
route.get('/register', site_controller.register);
route.get('/', site_controller.home);



module.exports = route;
