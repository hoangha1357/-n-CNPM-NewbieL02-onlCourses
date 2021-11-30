const mongoose = require('mongoose');
const User = require('./Userid');
const Course = require('./Course');
const Schema = mongoose.Schema;

const Comment = new Schema({
    comment: { type: String },
    User_id: { type: Schema.Types.ObjectId , ref: 'User' },
    Course_id: { type: Schema.Types.ObjectId, ref: 'Course' },
    answer:[{
        User_id: { type: Schema.Types.ObjectId, ref: 'User' },
        comment: { type: String },
        cmDate: {type: Date}
    }]
}, {
    timestamps: true
}, );


module.exports = mongoose.model('Comment', Comment);