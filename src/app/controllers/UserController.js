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
    // [GET] /user/courses
    courses(req, res,next) {}

    // [GET] /user/viewrevenue
    viewrevenue(req, res, next) {
        // res.json(req.session.email);
        Promise.all([User.findOne({email: req.session.email.username}),Course.find({}).sortable(req), Course.countDocumentsDeleted()])
            .then(([user, courses, deletedCount]) => {
                res.render('user/viewrevenue', {
                    deletedCount,
                    courses: mutiMongoosetoObject(courses),
                    user: MongoosetoObject(user),
                });
            })
            .catch(next);
    }

    // [GET] /user/trash
    trash(req, res, next) {
        Course.findDeleted({})
            .then((courses) => {
                res.render('user/trash', {
                    Coursees: mutiMongoosetoObject(courses),
                });
            })
            .catch(next);
    }

    // [POST] /user/register
    register(req, res, next) {
        bcryt.hash(req.body.password,10,function(err,hashedPass) {
            if(err) return res.json(err);
            let user = new User({
                email: req.body.email,
                password: hashedPass,
                name: req.body.name,
                gender: req.body.gender,
                address: req.body.address,
            });
            user.save()
                .then(() => res.redirect('/loginpage'))
                .catch((error) => {
                    res.json({message: error})
                })
        })
    }

    // [POST] /user/login
    login(req, res, next) {
        User.findOne({email: req.body.email})
            .then((user)=>{
                if(!user) return res.render('loginpage',{massage: "User not found"});
                const email = user.email;
                bcryt.compare(req.body.password,user.password)
                    .then((result) => {
                        if(!result) return res.render('loginpage',{massage: "Wrong password",name: req.body.email});
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
}

module.exports = new UserController();
