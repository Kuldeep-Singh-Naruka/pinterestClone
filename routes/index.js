var express = require('express');
var router = express.Router();
//i add some model and package form here
const userModel = require("./users");
const postModel = require("./post");
//this will help us to save
const passport = require('passport');
const upload = require('./multer');
//This two lines will help us to login user
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{nav:false});
});

router.post('/fileupload',isLoggedIn,upload.single("image"), async function(req, res, next) {
 const user = await userModel.findOne({username:req.session.passport.user});
 user.profileImage = req.file.filename;
 await user.save();
 res.redirect("/profile");
});

router.get('/profile',isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username:req.session.passport.user}).populate('posts');
  res.render('profile',{user, nav:true});
});

router.get('/show/posts',isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username:req.session.passport.user}).populate('posts');
  res.render('show',{user, nav:true});
});

router.get('/feed',isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username:req.session.passport.user});
  const posts = await postModel.find().populate("user")
  res.render('feed',{user, posts, nav:true});
});

router.get('/add',isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username:req.session.passport.user});
  res.render('add',{user, nav:true});
});
router.post('/createpost',isLoggedIn, upload.single("postimage"), async function(req, res, next) {
  const user = await userModel.findOne({username:req.session.passport.user});
const post = await postModel.create({
  user: user._id,
  title: req.body.title,
  discription : req.body.discription,
  postimage: req.file.filename
});
user.posts.push(post._id);
await user.save();
res.redirect("/profile");
});

router.get('/register', function(req, res, next) {
  res.render('register',{nav:false});
});
router.post('/register', function(req, res, next) {
  const data = new userModel({
    username:req.body.username,
    contact:req.body.contact,
    email:req.body.email,
    name:req.body.name,
  })

  userModel.register(data,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res, function(){
      res.redirect("/profile")
    })
  })
});

// this will help us to login the user
router.post('/login',passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/",
 // failureFlash:true,
}), function(req, res) {
  
});

// this will help the user to logout form there profile
router.get("/logout",function(req,res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

// to check user is login or not
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/");
}

module.exports = router;
