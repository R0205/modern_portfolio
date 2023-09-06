const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')

// User Model
const User = require('../modals/User');
const { route } = require('.');
// Login page
router.get('/login', (req, res) => res.render("login")); // here we are creating a get requiest to server
// Register page

router.get('/register', (req, res) => res.render('register'));



// REGISTER HANDLE

router.post('/register', (req, res) => {

    // Destructuring data;
    const { name, email, password, password2 } = req.body; // we have to pull out this variables from body
    let errors = [] // this is for handling errror

    // check the required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'all fields are required' });
    }

    // pasword matching cheque
    if (password !== password2) {
        errors.push({ msg: 'password do not match' })
    }

    // check password length
    if (password.length < 6) {
        errors.push({ msg: 'password must be at least 6 character' })


    }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // validation passed
        User.findOne({ email: email })// this is for matching the the email from data base to client side,
            .then(user => {
                if (user) {
                    // User exist
                    errors.push({ msg: "Email is already register" });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                    // user is not registerd we have to create new user and bcrypt the password
                } else {
                    const newUser = new User({
                        // in here we are only creating the user but we are not saving the data base thats why it is not showing in data base
                        name,
                        email,
                        password
                    });

                    // for bcrypting password

                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw (err);

                        // set password to hashed
                        newUser.password = hash;

                        // saved user for showing the user data in database
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registered and can you login')
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));

                    }));

                }
            })
    }
});

//Login handle

router.post('/login', (req, res, next) => {

    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true


    })(req, res, next);

})

// Logout handle

router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            console.log('Error logging out', err)
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/users/login');
    });

});




module.exports = router;

