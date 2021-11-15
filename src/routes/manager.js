const express = require('express');
const route = express.Router();

const ManagerController = require('../app/controllers/ManagerController');

route.get('/courses-management', ManagerController.coursesManagement);
route.get('/trash', ManagerController.trash);
route.get('/:id/edit', ManagerController.edit);
route.get('/create', ManagerController.create);

module.exports = route;
