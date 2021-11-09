// viet ham phu
const imageMimeTypes            = ['image/jpg', 'image/png','image/gif'];
module.exports = {
    mutiMongoosetoObject: function (mgarray) {
        return mgarray.map((mgarray) => mgarray.toObject());
    },
    MongoosetoObject: function (mongoose) {
        return mongoose ? mongoose.toObject() : mongoose;
    },
    modifyRequestImage: function (req){
        if(req.body.image) {
            const image = JSON.parse(req.body.image);
            if(image && imageMimeTypes.includes(image.type)){
                req.body.image = new Buffer.from(image.data,'base64');
                req.body.imageType = image.type;
            }
        }
    }
};
