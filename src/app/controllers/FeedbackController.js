const Feedback = require('../models/Feedback');


class FeedbackController {
    //Get /feedback
    getPage(req, res, next) {
        if(!req.query.page) req.query.page = 1;
        Promise.all([Feedback.find({}).sort({createdAt: -1}).lean().populate('User_id').limit(6).skip((req.query.page - 1) * 6), Feedback.countDocuments()])
            .then(([feedbacks,count]) => { 
                res.render('Site/feedback', { 
                    layout: 'main',
                    user: req.user, 
                    data: feedbacks, 
                    mode: 'unauthen',
                    count,
                    page: req.query.page,});
            })
            .catch(err => {res.json(err)});
    };

    //Post /feedback
    addFeedback(req, res, next) {
        const feedback = new Feedback({
            comment: req.body.comment,
            User_id: req.body.id
        });
        feedback.save()
            .then(() => res.redirect('/feedback'))
            .catch((error) => {
                console.log(error);
            });
    };

    //get user feedback
    getUserFB(req, res, next) {
        Feedback.find({}, function(err, data) {
            res.render('Site/feedback', { layout: 'main', user: req.user, data, mode: 'authen' });
        }).lean().populate({
            path: 'User_id',
            match: { email: req.params.email }
        });

    };


    //post delete feedback
    deleteFeedback(req, res, next) {
        var id = req.params.id;
        var user = req.user;
        Feedback.findByIdAndRemove(id).exec()
            .then(() => {
                if (user.permission == 'Student') {
                    res.redirect(`/feedback/${user.email}`);
                } else {
                    res.redirect(`/feedback`);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }


    //Post edit feedback
    editFeedback(req, res, next) {
        var id = req.params.id;
        var user = req.user;
        Feedback.updateOne({ _id: id }, { $set: { comment: req.query.comment } })
            .exec()
            .then(() => {
                res.redirect(`/feedback/${user.email}`)
            })
            .catch((err) => {
                console.log(err);
            });
    }
}


module.exports = new FeedbackController();