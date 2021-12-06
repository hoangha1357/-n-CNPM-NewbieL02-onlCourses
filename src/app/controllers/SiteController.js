const Course = require('../models/Course');
const User = require('../models/Userid');
const { mutiMongoosetoObject, MongoosetoObject } = require('../../util/subfunction');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Feedback = require('../models/Feedback');
class SiteController {

    home(req, res, next) {
        Promise.all([ Course.find({recommend: true}),Feedback.find({}).sort({createdAt: -1}).populate('User_id').limit(3)])
            .then(([courses,feedbacks]) => {
                    res.render('Site/home', {
                        courses: mutiMongoosetoObject(courses),
                        feedbacks: mutiMongoosetoObject(feedbacks),
                        user: req.user,
                    })
            })
            .catch(next);
        // if(req.session.email) var email = req.session.email.username;
        // Promise.all([Course.find({ recommend: true }),User.findOne({email: email})])
        //     .then(([courses,user]) => {
        //         res.render('home', {
        //             courses: mutiMongoosetoObject(courses),
        //             user:    MongoosetoObject(user), 
        //         });
        //     })
        //     .catch(next);
    }

    search(req, res) {
        if(req.query.coursename){
            console.log(req.query.coursename);
            const searchFied = req.query.coursename;
            Course.find({name:{$regex: searchFied, $options: '$i'}})
                .then((courses) => {
                    res.render('Site/search', { 
                        user: req.user,
                        courses: mutiMongoosetoObject(courses),
                    });
                })    
        }
        else return res.render('Site/search', { user: req.user});  
    }

    loginpage(req, res, next) {
        res.render('Site/loginpage');
    }

    register(req, res) {
        res.render('Site/register');
    }

    resetpassword(req, res, next) {
        res.render('Site/resetpassword');
    }

    resetpasswordpost(req, res, next) {
        User.findOne({ email: req.body.email })
            .then((user) => {
                if(!user) res.render('Site/resetpassword',{message: 'User not found'});
                else {
                    const secret = process.env.ACCESS_TOKEN_SECRET + user.password;
                    const payload = {
                        email: user.email,
                        id: user._id
                    }
                    const token = jwt.sign(payload, secret, {expiresIn: '10m'} );
                    const link  = 'http://localhost:3000/user/resetpassword/'+user._id+'/'+token;
                    // console.log(link);
                    const mailcontent = ' <p>This is an reset password link for '+user.email+'</p><p>the link will expires in 10 minute</p><a href='+link+'>Click here</a>'

                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                          user: process.env.HostMail, // generated ethereal user
                          pass: process.env.Mailpass, // generated ethereal password
                        }
                      });
                    
                      // send mail with defined transport object
                      let info ={
                        from: '"ResPos" <respos1357@gmail.com>', // sender address
                        to: user.email, // list of receivers
                        subject: "Reset password request", // Subject line
                        text: "Hello world?", // plain text body
                        html: mailcontent, // html body
                      };
                      transporter.sendMail(info)
                        .then(() =>{ res.render('Site/resetpassword',{message: 'Link lấy lại mật khẩu đã được gửi tới địa chỉ email của bạn'})})
                        .catch(err =>{res.json({message: err.message})})
                }
            })
            .catch((err) => {res.json({message: err.message})})
        
    }
}


module.exports = new SiteController();