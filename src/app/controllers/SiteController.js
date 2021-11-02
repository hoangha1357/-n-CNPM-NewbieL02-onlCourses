const { mutiMongoosetoObject } = require('../../util/mongoose');

class SiteController {
    home(req, res, next) {
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
