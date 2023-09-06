const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
// load user model
const User = require('../modals/User');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'That email is not registerd' })// null for the error, false for the user, message

                    }
                    // match password

                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            return done(null, user)
                        }
                        else {
                            return done(null, false, { message: 'password incorrect' })
                        }


                    })
                })
                .catch(err => console.log(err))

        })

    );

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id)
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                done(err, null);
            });

    });

}
