const Feedback = require('../models/Feedback');


class FeedbackController {
    //Get /feedback
    getPage(req, res, next) {
        Feedback.find({}, function(err, data) {
            res.render('feedback', { layout: 'index', user: req.user, data });
        }).lean().populate('User_id');
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

};

module.exports = new FeedbackController();