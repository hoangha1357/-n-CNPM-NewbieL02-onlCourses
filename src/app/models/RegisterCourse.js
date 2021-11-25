const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegisterCourse = new Schema({
    Course_id:{type: Schema.Types.ObjectId,  ref: 'Course', required: true},
    User_id:{type: Schema.Types.ObjectId, ref: 'User',required: true},
},{
    timestamps: true
}
)

module.exports = mongoose.model('RegisterCourse', RegisterCourse);