const LocalStrategy = require('passport-local').Strategy;
const bcrypt        = require('bcrypt');
const Userid        = require('../app/models/Userid');

function initializePassport(passport) {
    const authenticateUser = async (email, password, done) => {
        // Userid.findOne({email: email})
        //     .then((userid)=>{
        //         if(!userid) return done(null, false, { message: 'No user with that email' });
        //         bcrypt.compare(password,userid.password)
        //             .then((result) => {
        //                 if(!result) return done(null, false, { message: 'Password incorrect' });
        //                 res.json(userid);
        //                 return done(null, userid);
        //             })
        //             .catch((error) =>{ res.send({massage: error}) });
        //     })
        //     .catch(error => {res.send({massage: error})});
        const user = Userid.find({ email: email}).exec();
        if (!user) {
            return done(null, false, { message: 'No user with that email' });
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' })
            }
        } catch (error) {
                return done(error);
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'email' },authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        return done(null, Userid.findById(id))
    });
} 
module.exports = initializePassport;