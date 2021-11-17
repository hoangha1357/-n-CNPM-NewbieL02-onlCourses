const courseRouter = require('./course');
const siteRouter = require('./site');
const userRouter = require('./user');
const managerRouter = require('./manager');
const feedbackRouter = require('./feedback');

function route(app) {
    app.use('/course', courseRouter);
    app.use('/user', userRouter);
    app.use('/manager', managerRouter);
    app.use('/', siteRouter);
    app.use('/feedback', feedbackRouter);
}

module.exports = route;