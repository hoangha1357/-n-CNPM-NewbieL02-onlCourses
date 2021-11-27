const express = require('express');
const route = express.Router();

const courses_Controller = require('../app/controllers/CoursesController');
const getVieotime = require('../app/middlewares/getVideotime')
const managerRequires = require('../app/middlewares/ManagerRequires');


route.post('/store', getVieotime, courses_Controller.store);
route.get('/:slug', courses_Controller.show);
route.post('/handle-form-action',managerRequires,courses_Controller.handleFormAction);
route.put('/:id', managerRequires,courses_Controller.update);
route.patch('/:id/restore',managerRequires, courses_Controller.restore);
route.delete('/:id', courses_Controller.delete);
route.post('/:id/addlesson',managerRequires, getVieotime, courses_Controller.addlesson);
route.put('/updateLesson/:id',managerRequires, getVieotime, courses_Controller.updatelesson);
route.delete('/lesson/:id',managerRequires, courses_Controller.deletelesson);
route.delete('/:id/force',managerRequires, courses_Controller.permanentdelete);
route.get('/', courses_Controller.index);

module.exports = route;
