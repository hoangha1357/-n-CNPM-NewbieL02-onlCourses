const Course = require('../models/Course');
const User = require('../models/Userid');
const { mutiMongoosetoObject, MongoosetoObject } = require('../../util/subfunction');
const Feedback = require('../models/Feedback');
class SiteController {

    home(req, res, next) {
        Course.find({})
            .then((courses) => {
                Feedback.find({}).populate('User_id').limit(3).then((feedbacks) => {
                    res.render('home', {
                        courses: mutiMongoosetoObject(courses),
                        feedbacks: mutiMongoosetoObject(feedbacks),
                        user: req.user,
                    });
                });

            })
            .catch(next);
        // if(req.session.email) var email = req.session.email.username;
        // Promise.all([Course.find({ recommend: true }),User.findOne({email: email})])
        //     .then(([courses,user]) => {
        //         res.render('home', {
        //             courses: mutiMongoosetoObject(courses),
        //             user:    MongoosetoObject(user), 
        //         });
        //     })
        //     .catch(next);
    }

    search(req, res) {
        res.render('search');
    }

    loginpage(req, res, next) {
        res.render('loginpage');
    }

    register(req, res) {
        res.render('register');
    }

    booktable(req, res) {
        res.render('book_table', { email: req.session.email });
    }
}


module.exports = new SiteController();