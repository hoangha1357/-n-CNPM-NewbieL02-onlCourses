const methodOverride = require('method-override');
const slug = require('mongoose-slug-generator');
const mongoose = require('mongoose');
const Course = require('../models/Course');
const mongoosedelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const Lesson = new Schema(
    {
        // _id:    {type: Number},
        name: { type: String, maxlength: 100},
        description: { type: String ,maxlength: 500},
        url: { type: String},
        videotime: { type: String},
        Course_id:{type: Schema.Types.ObjectId,  ref: 'Course', required: true}
    },
    {
        // _id: false, 
        timestamps: true 
    },
);

//add plug in
mongoose.plugin(slug);
// Course.plugin(AutoIncrement)
Lesson.plugin(mongoosedelete, {
    overrideMethods: 'all',
    deletedAt: true,
});

module.exports = mongoose.model('Lesson', Lesson);
