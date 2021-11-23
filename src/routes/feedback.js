const express = require('express');
const FeedbackController = require('../app/controllers/FeedbackController');
const route = express.Router();
const feedback_Controller = require('../app/controllers/FeedbackController');
const getUser = require('../app/middlewares/SetUser');


route.get('/', getUser, feedback_Controller.getPage);
route.post('/', feedback_Controller.addFeedback);
route.get('/:email', feedback_Controller.getUserFB);


route.get('/delete/:id', feedback_Controller.deleteFeedback);
route.get('/update/:id', feedback_Controller.editFeedback)
module.exports = route;