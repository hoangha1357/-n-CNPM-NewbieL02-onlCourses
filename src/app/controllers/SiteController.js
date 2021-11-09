const Course = require('../models/Course');
const { mutiMongoosetoObject } = require('../../util/subfunction');

class SiteController {
    home(req, res, next) {
        Course.find({ recommend: true })
            .then((courses) => {
                res.render('home', {
                    courses: mutiMongoosetoObject(courses),
                    email: req.session.email, 
                });
            })
            .catch(next);
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
        res.render('book_table',{email: req.session.email});
    }
}


module.exports = new SiteController();
