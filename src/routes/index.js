const menuRouter = require('./menu');
const siteRouter = require('./site');
const userRouter = require('./user');

function route(app) {
    app.use('/menu', menuRouter);
    app.use('/user', userRouter);
    app.use('/', siteRouter);
}

module.exports = route;
