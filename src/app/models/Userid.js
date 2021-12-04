const mongoose = require('mongoose');
const Course = require('./Course')
const Schema = mongoose.Schema;


const User = new Schema({
    email: { type: String, unique: true },
    image: { type: Buffer },
    imageType: { type: String },
    password: { type: String },
    permission: { type: String, default: 'Student' },
    name: { type: String, maxlength: 100, required: true },
    gender: { type: String, required: true },
    phonenumber: { type: String },
    registeredCourseIds: [{type: String, ref: 'Course'}],
}, {
    timestamps: true
}, );

module.exports = mongoose.model('User', User);