const express = require('express');
const route = express.Router();
const feedback_Controller = require('../app/controllers/FeedbackController');
const getUser = require('../app/middlewares/SetUser');
const requireLogin = require('../app/middlewares/LoginRequires');

route.get('/', getUser, feedback_Controller.getPage);
route.post('/', feedback_Controller.addFeedback);
route.get('/:email',requireLogin, feedback_Controller.getUserFB);


route.get('/delete/:id',requireLogin, feedback_Controller.deleteFeedback);
route.get('/update/:id',requireLogin, feedback_Controller.editFeedback)
module.exports = route;