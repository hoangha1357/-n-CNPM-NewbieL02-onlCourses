const Course                      = require('../models/Course');
const { mutiMongoosetoObject,MongoosetoObject,modifyRequestImage }  = require('../../util/subfunction');
const imageMimeTypes            = ['image/jpg', 'image/png','image/gif'];

class MenuController {
    //get course
    index(req, res, next) {
        var email;
        if(!req.query.page) req.query.page = 1;
        if(req.session.email) email = req.session.email;
        // const courses = Course.find({}).limit(6).skip((req.query.page - 1) * 5).exec();
        // const count  = Course.countDocuments();
        Promise.all([Course.find({}).limit(6).skip((req.query.page - 1) * 6), Course.countDocuments()])
            .then(([courses, count]) => {
                res.render('course', { 
                    courses: mutiMongoosetoObject(courses),
                    count,
                    page: req.query.page,
                    email: email,
                });
            })
            .catch(next);
    }
    // [Get] /course/:slug
    show(req, res, next){}
    // [Get] /course/create
    create(req, res, next) {
        res.render('Menusub/create',{email: req.session.email});
    }
    // [Get] /course/create
    create(req, res, next) {
        res.render('Menusub/create',{email: req.session.email});
    }
    // [POST] /course/store
    store(req, res, next) {
        modifyRequestImage(req);
        const Course = new Course({
            re
        });

        Course.save()
            .then(() => res.redirect('/user/viewrevenue'))
            .catch((error) => {
                res.json(error);
            });
    }

    // [Get] /course/:id/edit
    edit(req, res, next) {
        Course.findById(req.params.id)
            .then((Course) =>
                res.render('Menusub/edit', {
                    Course: MongoosetoObject(Course),
                }),
            )
            .catch(next);
    }

    // [PUT] /course/:id
    update(req, res, next) {
        Course.updateOne({ _id: req.params.id }, {$set: {name: req.body.name, price: req.body.price, Course_type: req.body.Course_type}})
            .then(() => res.redirect('/User/viewrevenue'))
            .catch(next);
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
                Course.delete({ _id: { $in : req.body.CourseIds} })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'add-recommed':
                Course.updateMany({ _id: { $in : req.body.CourseIds} }, {recommend: true})
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'remove-recommed':
                Course.updateMany({ _id: { $in : req.body.CourseIds} }, {recommend: false})
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'permanent-delete':
                Course.deleteMany({ _id: { $in : req.body.CourseIds} })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'restore':
                Course.restore({ _id: { $in : req.body.CourseIds} })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.send('Invalid Action');
        }
    }
}



module.exports = new MenuController();

