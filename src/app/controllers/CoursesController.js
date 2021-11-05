const Dish                      = require('../models/Course');
const { mutiMongoosetoObject,MongoosetoObject }  = require('../../util/mongoose');
const imageMimeTypes            = ['image/jpg', 'image/png','image/gif'];

class MenuController {
    //get menu
    index(req, res, next) {
        var email;
        if(!req.query.page) req.query.page = 1;
        if(req.session.email) email = req.session.email;
        // const dishes = Dish.find({}).limit(6).skip((req.query.page - 1) * 5).exec();
        // const count  = Dish.countDocuments();
        Promise.all([Dish.find({}).limit(6).skip((req.query.page - 1) * 6), Dish.countDocuments()])
            .then(([dishes, count]) => {
                res.render('menu', { 
                    dishes: mutiMongoosetoObject(dishes),
                    count,
                    page: req.query.page,
                    email: email,
                });
            })
            .catch(next);
    }
    // [Get] /menu/create
    create(req, res, next) {
        res.render('Menusub/create',{email: req.session.email});
    }
    
    // [POST] /menu/store
    store(req, res, next) {
        modifyRequestImage(req);
        const dish = new Dish(req.body);

        dish.save()
            .then(() => res.redirect('/user/viewrevenue'))
            .catch((error) => {
                res.json(error);
            });
    }

    // [Get] /menu/:id/edit
    edit(req, res, next) {
        Dish.findById(req.params.id)
            .then((dish) =>
                res.render('Menusub/edit', {
                    dish: MongoosetoObject(dish),
                }),
            )
            .catch(next);
    }

    // [PUT] /menu/:id
    update(req, res, next) {
        
        if(req.body.image){
            modifyRequestImage(req);
            Dish.updateOne({ _id: req.params.id }, req.body)
                .then(() => res.redirect('/User/viewrevenue'))
                .catch(next);
        }
        else{
            Dish.updateOne({ _id: req.params.id }, {$set: {name: req.body.name, price: req.body.price, dish_type: req.body.dish_type}})
                .then(() => res.redirect('/User/viewrevenue'))
                .catch(next);
        }
    }

    // [DELETE] /menu/:id
    delete(req, res, next) {
        Dish.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // [DELETE] /menu/:id/force
    permanentdelete(req, res, next) {
        Dish.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // [PATCH] /menu/:id/restore
    restore(req, res, next) {
        Dish.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    //[POST] /menu/handle-form-action
    handleFormAction(req, res, next){
        switch(req.body.action){
            case 'delete':
                Dish.delete({ _id: { $in : req.body.dishIds} })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'add-recommed':
                Dish.updateMany({ _id: { $in : req.body.dishIds} }, {recommend: true})
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'remove-recommed':
                Dish.updateMany({ _id: { $in : req.body.dishIds} }, {recommend: false})
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'permanent-delete':
                Dish.deleteMany({ _id: { $in : req.body.dishIds} })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'restore':
                Dish.restore({ _id: { $in : req.body.dishIds} })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.send('Invalid Action');
        }
    }
}

function modifyRequestImage(req){
    if(req.body.image) {
        const image = JSON.parse(req.body.image);
        if(image && imageMimeTypes.includes(image.type)){
            req.body.image = new Buffer.from(image.data,'base64');
            req.body.imageType = image.type;
        }
    }
}

module.exports = new MenuController();

