const Course  = require('../models/Course');
const Lesson = require('../models/Lesson');
const Comment = require('../models/Comment');
const User = require('../models/Userid')
const { mutiMongoosetoObject,MongoosetoObject,modifyRequestImage }  = require('../../util/subfunction');
const request = require('request');
//const got = require('got');
// const { getVideoDurationInSeconds } = require('get-video-duration');
// var fetchVideoInfo = require('youtube-info');


class CourseController {
    //get course
    index(req, res, next) {
        if(!req.query.page) req.query.page = 1;
        
        Promise.all([Course.find({}).limit(8).skip((req.query.page - 1) * 8), Course.countDocuments()])
            .then(([courses, count]) => {
                res.render('Course/Courseindex', { 
                    courses: mutiMongoosetoObject(courses),
                    count,
                    page: req.query.page,
                    user: req.user,
                });
            })
            .catch(next);
    }

    // [Get] /course/:slug
    show(req, res, next){
        Course.findOne({slug: req.params.slug})
            .then((course) =>{  
                Promise.all([Lesson.find({Course_id: course.id}), Lesson.countDocuments({Course_id: course.id}),Comment.find({Course_id: course.id}).lean().populate('User_id').populate('answer.User_id').sort({createdAt: -1})])
                    .then(([lessons,count,comments]) =>res.render('Course/coursesDetail',{
                        course: MongoosetoObject(course), 
                        lessons: mutiMongoosetoObject(lessons),
                        comments,
                        //userprofile: mutiMongoosetoObject(users),
                        count,
                        user: req.user
                    }))
                    .catch(err => {res.json(err.message)})
            })
            .catch(next);
    }

    // [POST] /course/store
    store(req, res, next) {
        if(req.body.name  == "") return res.redirect('back');
        Course.find({ name: req.body.name}, function(err, course) {
            if(err) return res.json(err.message);
            if(course.length > 0) return res.render('Course/create',{data: req.body, message: 'Khóa học đã tồn tại'});
            else{
                modifyRequestImage(req);
                const newcourse = new Course({
                    name: req.body.name, 
                    image: req.body.image,
                    author: req.body.author,
                    imageType: req.body.imageType,
                    description: req.body.description,
                });
                //res.json(course);
                newcourse.save()
                    .then(() => {
                        if(req.body.lesson){
                            if(Object.keys(req.body.lesson[0]).length > 1) {
                                for(var lesson in req.body.lesson){
                                    const newlesson = new Lesson({
                                        Course_id: course._id,
                                        name:  req.body.lesson[lesson],
                                        videotime: req.body.datalog[lesson].contentDetails.duration,
                                        url: req.body.lessonVideo[lesson],
                                        description: req.body.lessonDescription[lesson],
                                    })
                                    //console.log(newlesson);
                                    newlesson.save().catch((err) => {res.json({message: err.message})})
                                }

                            }else {
                                const newlesson = new Lesson({
                                    Course_id: course.id,
                                    name: req.body.lesson,
                                    url: req.body.lessonVideo,
                                    videotime: req.body.datalog[0].contentDetails.duration,
                                    description: req.body.lessonDescription,
                                })
                                //console.log(newlesson);
                                newlesson.save().catch((err) => {res.json({message: err.message})})
                            }
                        }
                        res.redirect('/manager/courses-management')
                    })
                    .catch((err) => {res.json({message: err.message})})
            }
            
        })  
    }

    // [PUT] /course/:id
    update(req, res, next) {
        if(req.body.image){
            modifyRequestImage(req);
            Course.updateOne({ _id: req.params.id },{$set: {
                        name: req.body.name,
                        author: req.body.author,  
                        image: req.body.image,
                        imageType: req.body.imageType,
                        description: req.body.description,
                    }})
                .then(() => res.redirect('/manager/courses-management'))
                .catch(next);   
        }
        else{
            Course.updateOne({ _id: req.params.id }, {$set: {name: req.body.name, description: req.body.description,author: req.body.author }})
                .then(() => res.redirect('/manager/courses-management'))
                .catch(next);
        }        
    }

    // [PATCH] /course/:id/restore
    restore(req, res, next) {
        Course.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // [DELETE] /course/:id
    delete(req, res, next) {
        Course.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // [POST] /course/:id/addlesson
    addlesson(req, res, next){
        const newlesson = new Lesson({
            Course_id: req.params.id,
            name: req.body.lesson,
            url: req.body.lessonVideo,
            videotime: req.body.datalog[0].contentDetails.duration,
            description: req.body.description
        })
        newlesson.save()
            .then(() => res.redirect('back'))
            .catch((err) => {res.json({message: err.message})})
    }

    // [POST] /course/updatelesson/:id
    updatelesson(req, res, next){
        Lesson.updateOne({_id: req.params.id}, {$set: {
            name: req.body.lesson, 
            url: req.body.lessonVideo,
            videotime: req.body.datalog[0].contentDetails.duration, 
            description: req.body.description}
        })
            .then(() => res.redirect('back'))
            .catch((err) => {res.json({message: err.message})})
    }

    
    // [DELETE] /course/lesson/:id
    deletelesson(req, res, next) {
        Lesson.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // [DELETE] /course/:id/force
    permanentdelete(req, res, next) {

        Promise.all([Lesson.deleteMany({ Course_id: req.params.id }),Course.deleteOne({ _id: req.params.id })])
            .then(([]) => res.redirect('back'))
            .catch((err) => {res.json({message: err.message})});
        
    }

    //[POST] /course/handle-form-action
    handleFormAction(req, res, next){
        switch(req.body.action){
            case 'delete':
                Course.delete({ _id: { $in : req.body.courseIds} })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'add-recommed':
                Course.updateMany({ _id: { $in : req.body.courseIds} }, {recommend: true})
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'remove-recommed':
                Course.updateMany({ _id: { $in : req.body.courseIds} }, {recommend: false})
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'permanent-delete':
                Promise.all([Course.deleteMany({ _id: { $in : req.body.courseIds} }),Lesson.deleteMany({ Course_id: { $in : req.body.courseIds} })])
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'restore':
                Course.restore({ _id: { $in : req.body.courseIds} })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.send('Invalid Action');
        }
    }

    
}

module.exports = new CourseController();

