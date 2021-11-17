const express = require('express');
const route = express.Router();
const feedback_Controller = require('../app/controllers/FeedbackController');
const getUser = require('../app/middlewares/SetUser');


route.get('/', getUser, feedback_Controller.getPage);
route.post('/', feedback_Controller.addFeedback);


module.exports = route;