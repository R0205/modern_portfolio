const express = require('express');
const router = express.Router(); // if you want to call router 
const { ensureAuthenticated } = require('../config/auth');

// when you want to create route you have to write below command

// welcome page;
router.get('/', (req, res) => {
    res.render('welcome',)
});// 'get' is a request command for this;

router.get('/dashboard', ensureAuthenticated, (req, res) =>
    res.render('dashboard', {
        name: req.user.name
    }))


module.exports = router;