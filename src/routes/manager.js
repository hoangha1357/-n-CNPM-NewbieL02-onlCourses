const express = require('express');
const route = express.Router();

const ManagerController = require('../app/controllers/ManagerController');
const managerRequires = require('../app/middlewares/ManagerRequires');
const requireLogin = require('../app/middlewares/LoginRequires');


route.use(requireLogin)
route.use(managerRequires)
route.get('/courses-management', ManagerController.coursesManagement);
route.get('/trash', ManagerController.trash);
route.get('/:id/edit', ManagerController.edit);
route.get('/create', ManagerController.create);

module.exports = route;
