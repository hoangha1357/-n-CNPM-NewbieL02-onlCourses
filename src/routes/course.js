const express = require('express');
const route = express.Router();

const courses_Controller = require('../app/controllers/CoursesController');
const getytdata = require('../app/middlewares/getVideotime')

route.post('/store', getytdata,courses_Controller.store);
route.post('/handle-form-action',courses_Controller.handleFormAction);
route.put('/:id', courses_Controller.update);
route.patch('/:id/restore', courses_Controller.restore);
route.delete('/:id', courses_Controller.delete);
route.post('/:id/addlesson',getytdata, courses_Controller.addlesson);
route.put('/updateLesson/:id',getytdata, courses_Controller.updatelesson);
route.delete('/lesson/:id', courses_Controller.deletelesson);
route.delete('/:id/force', courses_Controller.permanentdelete);
route.get('/:slug', courses_Controller.show);
route.get('/', courses_Controller.index);

module.exports = route;