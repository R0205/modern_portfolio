const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

// passport config

require('./config/passport')(passport);

const app = express();
// DB CONFIG
const db = require('./config/keys').MongoURI;

// Connect to MongoDB using Mongoose
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected....");
  })
  .catch((err) => {
    console.log(err);
  });


// we can initialije layout by using this command
const expressLayouts = require('express-ejs-layouts');


//allocate PORTS 
const PORT = process.env.PORT || 5000

//EJS
app.set('view engine', 'ejs');
app.use(expressLayouts);

// BODY PARSER ENCODED

app.use(express.urlencoded({ extended: false }))

// Express session middle ware

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));


//pasport midleware

app.use(passport.initialize());
app.use(passport.session());

//connect flash;
app.use(flash())

// global variable
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error= req.flash('error');
  next();
})



//ROUTES
app.use('/', require('./routes/index')); // here we can hit the routes
app.use('/users', require('./routes/users'));

//server connection
app.listen(PORT, () => console.log(`your server is running on port ${PORT}`));