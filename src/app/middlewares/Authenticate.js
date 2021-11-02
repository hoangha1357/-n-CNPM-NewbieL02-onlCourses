const jwt = require('jsonwebtoken');

module.exports = function authenticate (req, res, next){
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.decode(token,process.env.ACCESS_TOKEN_SECRET);
        req.session.email = decode;
        if(token && req.session.email) res.redirect('/');
        else res.render('loginpage',{massage: "invalid token"});
    }
    catch(err){
        res.json(err);
    }
}