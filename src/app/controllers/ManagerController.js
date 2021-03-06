const Course      = require('../models/Course');
const Lesson      = require('../models/Lesson');

const { mutiMongoosetoObject,MongoosetoObject }  = require('../../util/subfunction');

class ManagerController {
    index(req, res) {
        res.send('asd');
    }
    // [GET] /manager/courses-management
    coursesManagement(req, res, next) {
        if(!req.query.page) req.query.page = 1;
        // res.json(req.session.email);
        Promise.all([Course.find({}).limit(6).skip((req.query.page - 1) * 6).sortable(req), Course.countDocumentsDeleted(),Course.countDocuments()])
            .then(([courses, deletedCount, count]) => {
                res.render('Manager/coursesManagement', {
                    courses: mutiMongoosetoObject(courses),
                    page: req.query.page,
                    user: req.user,
                    count,
                    deletedCount,
                });
            })
            .catch(next);
    }

    // [GET] /manager/trash
    trash(req, res, next) {
        Course.findDeleted({})
            .then((courses) => {
                res.render('Manager/trash', {
                    courses: mutiMongoosetoObject(courses),
                    user: req.user,
                });
            })
            .catch(next);
    }
    
    create(req, res, next) {
        res.render('Course/create',{user: req.user,});
    }

    edit(req, res, next) {
        Promise.all([Course.findById(req.params.id),Lesson.find({Course_id: req.params.id})])
            .then(([course,lessons]) =>{
                res.render('Course/edit', {
                    course: MongoosetoObject(course),
                    lessons: mutiMongoosetoObject(lessons),
                    user: req.user,
                }) 
            })
            .catch(next);
    }
}

module.exports = new ManagerController();
