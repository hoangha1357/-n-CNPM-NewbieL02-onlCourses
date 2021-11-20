const express = require('express');
const route = express.Router();

const courses_Controller = require('../app/controllers/CoursesController');


route.post('/store', courses_Controller.store);
route.get('/:slug', courses_Controller.show);
route.post('/handle-form-action',courses_Controller.handleFormAction);
route.put('/:id', courses_Controller.update);
route.patch('/:id/restore', courses_Controller.restore);
route.delete('/:id', courses_Controller.delete);
route.post('/:id/addlesson', courses_Controller.addlesson);
route.delete('/lesson/:id', courses_Controller.deletelesson);
route.delete('/:id/force', courses_Controller.permanentdelete);
route.get('/', courses_Controller.index);

module.exports = route;
