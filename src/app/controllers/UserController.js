const Course      = require('../models/Course');
const User    = require('../models/Userid');
const bcryt     = require('bcrypt');
const jwt       = require('jsonwebtoken');
const { mutiMongoosetoObject,MongoosetoObject,modifyRequestImage }  = require('../../util/subfunction');

class UserController {
    index(req, res) {
        User.findOne({email: req.session.email.username})
            .then(user => {
                res.render('user/userinfo',{user: MongoosetoObject(user)})
            })
    }

    // [POST] /user/register
    register(req, res, next) {
        User.findOne({email: req.body.email})
            .then((user) => {
                if(user){
                    res.render('register', {
                        resinfo: req.body,
                        massage: 'User đã được sử dụng',
                    })
                }
                else if(req.body.password != req.body.cfpassword) {
                    res.render('register', {
                        resinfo: req.body,
                        massage: 'mật khẩu không khớp',
                    })
                }
                else {
                    bcryt.hash(req.body.password,10,function(err,hashedPass) {
                        if(err) return res.json(err);
                        let newuser = new User({
                            email: req.body.email,
                            password: hashedPass,
                            name: req.body.name,
                            gender: req.body.gender,
                            address: req.body.address,
                        });
                        newuser.save()
                            .then(() => res.redirect('/loginpage'))
                            .catch((error) => {
                                res.json({message: error})
                            })
                    })
                }
            })
            .catch((error) => res.json({message: error.message}));
        
    }

    // [POST] /user/login
    login(req, res, next) {
        User.findOne({email: req.body.email})
            .then((user)=>{
                if(!user) return res.render('Site/loginpage',{massage: "Email hoặc mật khẩu không chính xác",name: req.body.email});
                const email = user.email;
                bcryt.compare(req.body.password,user.password)
                    .then((result) => {
                        if(!result) return res.render('Site/loginpage',{massage: "Email hoặc mật khẩu không chính xác",name: req.body.email});
                        const token = jwt.sign({username: email},process.env.ACCESS_TOKEN_SECRET );
                        req.headers.authorization = 'Bearer '+ token;
                        next();
                    })
                    .catch((error) =>{
                        res.send({massage: error});
                    });
            })
            .catch(next);
    }
    // [GET] /user/logout
    logout(req, res, next) {
        if (req.session) {
          // delete session object
          req.session.destroy(function(err) {
            if(err) {
              return next(err);
            } else {
              return res.redirect('/');
            }
          });
        }
    }
    
    // [GET] /user/registeredCourse
    registeredCourse(req, res, next) {
        res.render('User/registeredCourse', {})
    }

    // [GET] /user/resetpassword/:id/:token
    resetPassword(req, res, next) {
        const {id, token} = req.params
        User.findOne({_id: id})
            .then(user =>{
                user = user.toObject();
                if(!user){
                    res.send('invalid id or token');
                    return
                }
                const secret = process.env.ACCESS_TOKEN_SECRET + user.password;
                try {
                    const payload = jwt.verify(token,secret);
                    res.render('user/resetUserPassword',{email: user.email, id: id, token})
                }catch(err){
                    res.send(err.message);
                }
            })
            .catch(err => {res.send(err.message)});
    }

    // [PUT] /user/updatepassword/:id/:token
    updatePassword(req, res, next){
        const {id, token} = req.params
        User.findOne({_id: id})
            .then(user =>{
                user = user.toObject();
                if(!user){
                    res.send('invalid id or token');
                    return
                }
                const secret = process.env.ACCESS_TOKEN_SECRET + user.password;
                try {
                    const payload = jwt.verify(token,secret);
                    bcryt.hash(req.body.password,10,function (err, hashedPass) {
                        if (err){ 
                            res.json(err) 
                            return 
                        };
                        User.updateOne({ _id: id}, {$set: {password: hashedPass}})
                            .then(() => res.redirect('/loginpage'))
                            .catch(err =>{res.json(err.message)});
                    })
                }catch(err){
                    res.send(err.message);
                }
            })
            .catch(err => {res.send(err.message)});
    }
}

module.exports = new UserController();
