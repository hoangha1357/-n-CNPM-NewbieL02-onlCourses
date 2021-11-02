const Dish = require('../models/Dish');
const { mutiMongoosetoObject } = require('../../util/mongoose');

class SiteController {
    home(req, res, next) {
        Dish.find({ recommend: true })
            .then((dishes) => {
                res.render('home', {
                    dishes: mutiMongoosetoObject(dishes),
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
