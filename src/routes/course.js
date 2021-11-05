const express = require('express');
const route = express.Router();

const courses_Controller = require('../app/controllers/CoursesController');

route.get('/create', courses_Controller.create);
route.post('/store', courses_Controller.store);
route.post('/handle-form-action',courses_Controller.handleFormAction);
route.get('/:id/edit', courses_Controller.edit);
route.put('/:id', courses_Controller.update);
route.patch('/:id/restore', courses_Controller.restore);
route.delete('/:id', courses_Controller.delete);
route.delete('/:id/force', courses_Controller.permanentdelete);
route.get('/', courses_Controller.index);

module.exports = route;
