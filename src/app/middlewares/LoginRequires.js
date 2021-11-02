const jwt = require('jsonwebtoken');

module.exports = function authentication(req, res, next) {
    if (req.session.email) {
      return next();
    } else {
      res.redirect('/loginpage');
    }
}