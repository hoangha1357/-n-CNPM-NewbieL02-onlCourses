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
            .catch((error) => res.json({message: error.message}));
    }

    // [GET] /update_info
    view_update_info(req, res) {
        res.render('user/update_info',{user: req.user})
    }

    // [PUT] /update_info
    submit_update_info(req, res) {
        modifyRequestImage(req)
        User.findOneAndUpdate({email: req.session.email.username}, {$set: {
                image: req.body.image ? req.body.image : req.user.image,
                imageType: req.body.imageType ? req.body.imageType : req.user.imageType,
                name: req.body.name, 
                gender: req.body.gender,
                phonenumber: req.body.phonenumber,
            }})
            .then(()=>res.redirect('/user'))
            .catch((error) => res.json({message: error.message}));
    }

    // [GET] /change_pass
    view_change_pass(req,res) {
        res.render('user/change_pass',{user: req.user})
    }

    // [PUT] /change_pass
    submit_change_pass(req, res) {
        User.findOne({email: req.user.email})
            .then((user)=>{           
                bcryt.compare(req.body.oldpass, user.password)
                    .then((result) => {
                        if(!result) return res.render('user/change_pass', {
                            massage: 'mật khẩu cũ không chính xác',
                            user: MongoosetoObject(user)
                        });
                        if(req.body.newpass != req.body.cfnewpass) {
                            return res.render('user/change_pass',{
                                massage: 'mật khẩu mới không khớp',
                                user: MongoosetoObject(user)
                            })
                        }
                        if(req.body.oldpass === req.body.newpass) {
                            return res.render('user/change_pass',{
                                massage: 'Hãy nhập mật khẩu mới ',
                                user: MongoosetoObject(user)
                            })
                        }
                        bcryt.hash(req.body.newpass,10,function(err,hashedPass) {
                            if(err) return res.json(err);
                            User.updateOne({ email: req.user.email}, {$set: {password: hashedPass}})
                                .then((user) => res.render('user/change_pass', {
                                    massage: 'Đổi mật khẩu thành công',
                                    user: req.user
                                }))
                                .catch(err =>{res.json(err.message)});
                        })
                    })
                    .catch((error) => {
                        res.send({massage: error});
                    });
            })
            .catch((error) => res.json({message: error.message}));
    }

    // [GET] /user/register/:id
    registerCourse(req,res) {

        Promise.all([User.findOne({email: req.user.email}),Course.findOne({_id: req.params.id})])
            .then(([user, course]) => {
                if (!user) { return res.json({message: err.message}) };
                user.registeredCourseIds.push(req.params.id);
                course.studentRes = course.studentRes + 1;
                Promise.all([user.save(),course.save()])
                    .then(()=>res.redirect('back'))
                    .catch((err) => {res.json({message: err.message})})
            })
            .catch((error) => res.json({message: error.message}))
    }
    // [GET] /user/registeredCourse
    viewRegisteredCourse(req, res, next) {
        Course.find({ _id: { $in : req.user.registeredCourseIds} })
            .then((registeredCourses) => {
                res.render('User/registeredCourse', {
                    courses: mutiMongoosetoObject(registeredCourses),
                    user: req.user
                })
            })
            .catch(next);
        
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
                        massage: 'Mật khẩu không khớp',
                    })
                }
                else if (req.body.password.length < 8) {
                    res.render('register', {
                        resinfo: req.body,
                        massage: 'Mật khẩu phải có ít nhất 8 kí tự',
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
                            phonenumber: req.body.phonenumber,
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
