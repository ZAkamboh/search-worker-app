const express = require("express");
const router = express.Router();
const signup = require("../models/user");
const bcrypt = require("bcrypt");
const passport=require('passport');
const Localstrategy=require('passport-local').Strategy;

router.get('/', (req, res) => {


    res.render("home/index.handlebars",{user:req.user});

})
router.get('/dashboard', (req, res) => {


    res.render("home/dashboard.handlebars");


})
router.get('/logout', (req, res) => {


    req.logOut();
    res.redirect('/');


})


router.get('/location', (req, res) => {
  //res.send('this is a location page')
     res.render('home/location.handlebars');

  });










router.get('/edit/:id', (req, res) => {
    signup.findOne({ _id: req.params.id }).then((post) => {
      res.render('home/edit.handlebars', { posts: post });
    })
  });

  router.post('/edit/:id', (req, res) => {
    let file = req.files.file;
        let filename = file.name;
        file.mv('./public/uploads/' + filename);
    signup.findOne({ _id: req.params.id }).then((post) => {
      post.name=req.body.name;
      post.email=req.body.email;
      post.password=req.body.password;
      post.select=req.body.select;
      post.file=filename;
      post.save().then(()=>{
          req.flash('update',"your profile successfully updated");
res.redirect('/');
      })
    })
  });




router.get('/signup', (req, res) => {


    res.render("home/signup.handlebars");


})

router.post('/signup', (req, res) => {
    let errors = [];

    if (!req.body.name) {
        errors.push({ message: 'username field is required' })

    }
    if (!req.body.email) {
        errors.push({ message: 'email is required' })

    }
    if (!req.body.password) {
        errors.push({ message: 'password field is required' })

    }
    if (!req.body.confirmpass) {
        errors.push({ message: ' plz match password' })

    }

    if (req.body.password !== req.body.confirmpass) {
        errors.push({ message: 'password field is not match' })

    }
    if (errors.length > 0) {
        res.render('home/signup.handlebars', { errors: errors })


    }

    else {

        signup.findOne({email:req.body.email}).then((response)=>{
if(response===null){


    let file = req.files.file;
        let filename = file.name;

        file.mv('./public/uploads/' + filename);


        const newsignup = new signup({

            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            select: req.body.select,
            file: filename

        })


        bcrypt.genSalt(10, (err, salt) => {

            bcrypt.hash(newsignup.password, salt, (err, hash) => {
                if (err) return err;
                newsignup.password = hash;




                newsignup.save().then(() => {
req.flash("success_message","you are successfully signup");
                    console.log('successfully data saved');
                    res.redirect("/login");

                })
                //bcrypt close

            })
        })
        //bcrypt close


} else{
    req.flash('error_message', 'That email already exist ');

    res.redirect('/signup');
}

})


    }

})


router.get('/login', (req, res) => {


    res.render("home/login.handlebars");


})


passport.use(new Localstrategy({usernameField:'email'},(email,password,done)=>{

    signup.findOne({email:email}).then((response)=>{

if(!response) return done (null,false,{message:'no user found'})
bcrypt.compare(password,response.password,(err,res)=>{

if (err) return err;
console.log(res);
if(res)
{
    return done(null,response);
}
else{
    return done(null, false, { message: "incorrect password" });
}
})
    })
}))






passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    signup.findById(id, function (err, user) {
        done(err, user);
    });
});











router.post('/loginus',

    passport.authenticate('local',{

successRedirect:'/',
failureRedirect:'/login',
failureFlash : true

    })
)



router.get('/home/search',(req,res)=>{


})







module.exports = router;
