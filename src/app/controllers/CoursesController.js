const Course      = require('../models/Course');
const User    = require('../models/Userid');
const bcryt     = require('bcrypt');
const jwt       = require('jsonwebtoken');
const { mutiMongoosetoObject,MongoosetoObject }  = require('../../util/mongoose');

class CourseController {
    index(req, res) {
        res.send('asd');
    }

}


module.exports = new CourseController();
