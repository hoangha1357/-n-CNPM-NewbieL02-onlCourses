const Course  = require('../models/Course');
const Lesson = require('../models/Lesson');
const { mutiMongoosetoObject,MongoosetoObject,modifyRequestImage }  = require('../../util/subfunction');
const { count } = require('../models/Course');


class CourseController {
    //get course
    index(req, res, next) {
        if(!req.query.page) req.query.page = 1;
        
        Promise.all([Course.find({}).limit(6).skip((req.query.page - 1) * 6), Course.countDocuments()])
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
                res.render('Course/coursesDetail',{course: MongoosetoObject(course), user: req.user})
            })
            .catch(next);
    }

    // [POST] /course/store
    store(req, res, next) {
        modifyRequestImage(req);
        const course = new Course({
            name: req.body.name, 
            image: req.body.image,
            author: req.body.author,
            imageType: req.body.imageType,
            description: req.body.description,
        });
        course.save()
            .then(() => {
                if(req.body.lesson) {
                    for(var lesson in req.body.lesson){
                        const newlesson = new Lesson({
                            Course_id: course._id,
                            name: req.body.lesson[lesson],
                            url: req.body.lessonVideo[lesson],
                            description: req.body.lessonDescription[lesson],
                        })
                        newlesson.save().catch((err) => {res.json({message: err.message})})
                    }
                }
                res.redirect('/manager/courses-management')
            })
            .catch((err) => {res.json({message: err.message})})  
        
    }

    // [PUT] /course/:id
    update(req, res, next) {
        if(req.body.image){
            modifyRequestImage(req);
            Course.updateOne({ _id: req.params.id },{$set: {
                        name: req.body.name, 
                        image: req.body.image,
                        imageType: req.body.imageType,
                        description: req.body.description,
                    }})
                .then(() => res.redirect('/manager/courses-management'))
                .catch(next);   
        }
        else{
            Course.updateOne({ _id: req.params.id }, {$set: {name: req.body.name, description: req.body.description}})
                .then(() => res.redirect('/manager/courses-management'))
                .catch(next);
        }        
    }

    // [POST] /course/:id/addlesson
    addlesson(req, res, next){
        const newlesson = new Lesson({
            Course_id: req.params.id,
            name: req.body.name,
            url: req.body.linkvideo,
        })
        newlesson.save()
            .then(() => res.redirect('back'))
            .catch((err) => {res.json({message: err.message})})
    }

    // [POST] /course/updatelesson/:id
    updatelesson(req, res, next){
        Lesson.updateOne({_id: req.params.id}, {$set: {name: req.body.lessonname, url: req.body.linkvideo, description: req.body.lessonDescription}})
            .then(() => res.redirect('back'))
            .catch((err) => {res.json({message: err.message})})
    }

    // [DELETE] /course/:id
    delete(req, res, next) {
        Course.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // [DELETE] /course/lesson/:id
    deletelesson(req, res, next) {
        Lesson.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // [DELETE] /course/:id/force
    permanentdelete(req, res, next) {
        Course.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // [PATCH] /course/:id/restore
    restore(req, res, next) {
        Course.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
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
                Course.deleteMany({ _id: { $in : req.body.courseIds} })
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

