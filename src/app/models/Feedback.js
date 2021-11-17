const mongoose = require('mongoose');
const User = require('./Userid');
const Schema = mongoose.Schema;

const Feedback = new Schema({
    comment: { type: String },
    User_id: { type: Schema.Types.ObjectId, ref: 'User' }

}, {
    timestamps: true
}, );


module.exports = mongoose.model('Feedback', Feedback);