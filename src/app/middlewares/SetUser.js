const User    = require('../models/Userid');
module.exports = function GetUser(req, res, next) {
    if (req.session.email) {
        User.findOne({email: req.session.email.username})
            .then((user) => {
                req.user = user.toObject();
                next()
            })
            .catch(next);
    } else {
      next();
    }
}