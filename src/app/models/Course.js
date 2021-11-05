const methodOverride = require('method-override');
const mongoose = require('mongoose');
const mongoosedelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const Course = new Schema(
    {
        name: { type: String, maxlength: 100, required: true },
        image: { type: Buffer, required: true },
        imageType: { type: String, required: true},
        Description: { type: String ,maxlength: 256}
    },
    { timestamps: true },
);

//custom query helpers
Course.query.sortable = function(req){
    if(req.query.hasOwnProperty('_sort')){
        return this.sort({
            [req.query.column]: req.query.type,
        });
    }
    return this;
};

//add plug in
// mongoose.plugin(slug);
Course.plugin(mongoosedelete, {
    overrideMethods: 'all',
    deletedAt: true,
});

module.exports = mongoose.model('Course', Course);
