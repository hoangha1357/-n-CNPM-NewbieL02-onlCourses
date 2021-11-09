const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/Newbie_courses', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected');
    } catch (error) {
        console.log("Can't connect");
    }
}

module.exports = { connect };
