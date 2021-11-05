const courseRouter = require('./course');
const siteRouter = require('./site');
const userRouter = require('./user');

function route(app) {
    app.use('/menu', courseRouter);
    app.use('/user', userRouter);
    app.use('/', siteRouter);
}

module.exports = route;
