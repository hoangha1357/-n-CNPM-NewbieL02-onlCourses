const methodOverride = require('method-override');
const slug = require('mongoose-slug-generator');
const mongoose = require('mongoose');
const mongoosedelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const Course = new Schema(
    {
        // _id:    {type: Number},
        name: { type: String, maxlength: 100},
        description: { type: String ,maxlength: 256},
        studentRes:{ type: Number, default:0},
        recommend:{type: Boolean, default: false},
        image: { type: Buffer, required: true },
        imageType: { type: String, required: true  },
        slug: { type: String, slug: 'name' },
        lessonList: {type: [String]}
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
