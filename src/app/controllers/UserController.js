const Dish      = require('../models/Dish');
const User    = require('../models/Userid');
const bcryt     = require('bcrypt');
const jwt       = require('jsonwebtoken');
const { mutiMongoosetoObject,MongoosetoObject }  = require('../../util/mongoose');

class UserController {
    index(req, res) {
        res.send('asd');
    }
    // [GET] /user/ordered
    // orderd(req, res) {}

    // [GET] /user/viewrevenue
    viewrevenue(req, res, next) {
        // res.json(req.session.email);
        Promise.all([User.findOne({email: req.session.email.username}),Dish.find({}).sortable(req), Dish.countDocumentsDeleted()])
            .then(([user, dishes, deletedCount]) => {
                res.render('user/viewrevenue', {
                    deletedCount,
                    dishes: mutiMongoosetoObject(dishes),
                    user: MongoosetoObject(user),
                    email: req.session.email,
                });
            })
            .catch(next);
    }

    // [GET] /user/trash
    trash(req, res, next) {
        Dish.findDeleted({})
            .then((dishes) => {
                res.render('user/trash', {
                    dishes: mutiMongoosetoObject(dishes),
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
