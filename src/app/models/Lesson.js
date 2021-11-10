const methodOverride = require('method-override');
const slug = require('mongoose-slug-generator');
const mongoose = require('mongoose');
const mongoosedelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const Lesson = new Schema(
    {
        // _id:    {type: Number},
        name: { type: String, maxlength: 100},
        description: { type: String ,maxlength: 256},
        url: { type: String, required: true},
        image: { type: String },
        Course_id:{type: mongoose.Schema.type.Object_id, required: true, ref: 'Course'}
    },
    {
        // _id: false, 
        timestamps: true 
    },
);

//add plug in
mongoose.plugin(slug);
// Course.plugin(AutoIncrement)
Course.plugin(mongoosedelete, {
    overrideMethods: 'all',
    deletedAt: true,
});

module.exports = mongoose.model('Course', Course);
