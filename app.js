
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const bodyparser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const fileupload = require("express-fileupload");
const flash = require("connect-flash");
//const flash =require("flash");
const session = require('express-session');
const passport = require('passport');
//const methodoverride=require('method-override');

mongoose.connect("mongodb://localhost/helpersignup").then(() => {

    console.log("successfully connect database");


})



//app.use(methodoverride('_method'));
app.use(session({

    secret: 'zubairkamboh',
    resave: true,
    saveUninitialized: true

}));

app.use(passport.initialize());
app.use(passport.session());



app.use(flash());

app.use((req, res, next) => {

    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error=req.flash('error');
    res.locals.update=req.flash('update');
    //console.log(req.flash);
    next();

})

//app.use
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileupload());


// routers require
const home = require('./routes/home');
app.use('/', home);


// set engine 
app.engine('handlebars', exphbs({ defaultLayout: 'home' }));

app.set('view engine', 'handlebars');






const port = 4444;
app.listen(port, (res) => {

    console.log('listening on port 4444');
    //res.send('listening on port 4444')
});
