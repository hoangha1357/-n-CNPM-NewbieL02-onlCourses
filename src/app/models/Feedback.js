const methodOverride = require('method-override');
const slug = require('mongoose-slug-generator');
const mongoose = require('mongoose');
const mongoosedelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const User = require('./Userid');
const Schema = mongoose.Schema;

const Feedback = new Schema({
    comment: { type: String },
    User_id: { type: Schema.Types.ObjectId, ref: 'User' }

}, {
    timestamps: true
}, );


module.exports = mongoose.model('Feedback', Feedback);