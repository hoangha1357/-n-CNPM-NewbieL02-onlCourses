const Course                      = require('../models/Course');
const User    = require('../models/Userid');
const { mutiMongoosetoObject,MongoosetoObject,modifyRequestImage }  = require('../../util/subfunction');


class CourseController {
    //get course
    index(req, res, next) {
        // if(!req.query.page) req.query.page = 1;
        // if(req.session.email) var user = User.findOne({email: req.session.email.username}).exec();
        // // const courses = Course.find({}).limit(6).skip((req.query.page - 1) * 5).exec();
        // // const count  = Course.countDocuments();
        
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
        Course.findOne({slug: req.req.params.slug})
            .then((course) =>{
                res.render('Course/coursesDetail')
            })
            .catch(next);
    }
    // [Get] /course/create
    create(req, res, next) {
        res.render('Course/create',{user: req.user});
    }

    // [POST] /course/store
    store(req, res, next) {
        modifyRequestImage(req);
        const course = new Course({
            name: req.body.name, 
            image: req.body.image,
            imageType: req.body.imageType,
            description: req.body.description,
        });
        course.save()
            .then(() => res.redirect('/'))
            .catch((error) => {
                res.json({message: 'dcm'});
            });
    }

    // [Get] /course/:id/edit
    edit(req, res, next) {
        Course.findById(req.params.id)
            .then((course) =>
                res.render('Course/edit', {
                    course: MongoosetoObject(course),
                    user: req.user
                }),
            )
            .catch(next);
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
                .then(() => res.redirect('/user/courses-management'))
                .catch(next);   
        }
        else{
            Course.updateOne({ _id: req.params.id }, {$set: {name: req.body.name, description: req.body.description}})
                .then(() => res.redirect('/user/courses-management'))
                .catch(next);
        }        
    }

    // [DELETE] /course/:id
    delete(req, res, next) {
        Course.delete({ _id: req.params.id })
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

