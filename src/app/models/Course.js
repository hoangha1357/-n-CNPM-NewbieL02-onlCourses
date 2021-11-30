const methodOverride = require('method-override');
const slug = require('mongoose-slug-updater');
const mongoose = require('mongoose');
const mongoosedelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const Course = new Schema(
    {
        // _id:    {type: Number},
        name: { type: String, maxlength: 100, unique: true},
        description: { type: String ,maxlength: 256},
        studentRes:{ type: Number, default:0},
        recommend:{type: Boolean, default: false},
        author:{type: String},
        image: { type: Buffer},
        imageType: { type: String},
        slug: { type: String, slug: 'name' },
    },
    {
        // _id: false, 
        timestamps: true 
    },
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
mongoose.plugin(slug);
// Course.plugin(AutoIncrement)
Course.plugin(mongoosedelete, {
    overrideMethods: 'all',
    deletedAt: true,
});

module.exports = mongoose.model('Course', Course);
