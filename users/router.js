const express = require('express'),
      bodyParser = require('body-parser'),
      { User } = require('./models'),
      router = express.Router(),
      passport = require('passport'),
      localStrategy = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose'),
      config = require('../config'),
      jsonParser = bodyParser.json(),
      session = require('express-session'),
      app = express();

router.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: true }));
//===================
// app.use(require('express-session')({
//   secret: config.SECRET,
//   resave: false,
//   saveUninitialized: false
// }));

app.use(session ({
  secret: config.SECRET,
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==========================

router.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

// Post to register a new user
router.post('/create',(req, res) => {
 
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    
    if (err) {
      console.log(err);
      return res.render('signUp');
    }
console.log('user registered!');
    passport.authenticate('local')(req, res, function(){
      return res.redirect('/jokes/users/' + user._id);
    });
  });
});

// Post to log in an existing user
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/jokes/login'
}), (req, res) => {
 
 let {username} = req.body;

  return User.findOne({username})
  .then(user => {

      return res.redirect('/jokes/users/' + user._id);
  })
  .catch(err => console.log(err));

});

// Log out Route ends user session and redirects to homepage
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/jokes');
  // req.session.destroy(function (err) {
  //   req.user = null;
  //   res.redirect('/jokes');
  // }); 
});

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/jokes/login');
}

module.exports = {router};
