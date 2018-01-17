const express = require('express'),
      bodyParser = require('body-parser'),
      { User } = require('./models'),
      router = express.Router(),
      passport = require('passport'),
      localStrategy = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose'),
      config = require('../config'),
      jsonParser = bodyParser.json(),
      app = express();

router.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: true }));
//===================
app.use(passport.initialize());
app.use(passport.session());
app.use(require('express-session')({
  secret: config.SECRET,
  resave: false,
  saveUninitialized: false
}));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==========================

// Post to register a new user
router.post('/create',(req, res) => {
  // check if username and password is defined
  // const requiredFields = ['username', 'password'];
  // const missingField = requiredFields.find(field => !(field in req.body));
  //   if (missingField) {
  //     return res.status(422);
  // }
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
//check that all the fields are strings
  // const stringFields = ['username', 'password', 'firstName', 'lastName'];
  // const nonStringField = stringFields.find(
  //   field => field in req.body && typeof req.body[field] !== 'string'
  // );

  // if (nonStringField) {
  //   let error = 'Incorrect field type: expected string';
  //   return res.status(422).render('errorMessage', { error: error });
  // }
  // If the username and password aren't trimmed we give an error.  Users might
  // expect that these will work without trimming (i.e. they want the password
  // "foobar ", including the space at the end).  We need to reject such values
  // explicitly so the users know what's happening, rather than silently
  // trimming them and expecting the user to understand.
  // We'll silently trim the other fields, because they aren't credentials used
  // to log in, so it's less of a problem.
  // const explicityTrimmedFields = ['username', 'password'];
  // const nonTrimmedField = explicityTrimmedFields.find(
  //   field => req.body[field].trim() !== req.body[field]
  // );

  // if (nonTrimmedField) {
  //   let error = 'Cannot start or end with whitespace';
  //   return res.status(422).render('errorMessage', { error: error });
  // }
// check that username and password are the correct length
  // const sizedFields = {
  //   username: {
  //     min: 1
  //   },
  //   password: {
  //     min: 5,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
  //     max: 15
  //   }
  // };
  // const tooSmallField = Object.keys(sizedFields).find(
  //   field =>
  //     'min' in sizedFields[field] &&
  //           req.body[field].trim().length < sizedFields[field].min
  // );
  // const tooLargeField = Object.keys(sizedFields).find(
  //   field =>
  //     'max' in sizedFields[field] &&
  //           req.body[field].trim().length > sizedFields[field].max
  // );

  // if (tooSmallField || tooLargeField) {
  //  let error = "Password should be between 5 and 15 characters.";
   
  //   return res.status(422).render('errorMessage', { error: error });
  // }

  // let {username, password, firstName = '', lastName = ''} = req.body;
  // Username and password come in pre-trimmed, otherwise we throw an error
  // before this
  // firstName = firstName.trim();
  // lastName = lastName.trim();

  // return User.find({username})
  //   .count()
  //   .then(count => {
  //     if (count > 0) {
  //       // There is an existing user with the same username
  //     const message = "Username already taken. Sorry :(";
  //     return res.render('errorMessage', {error: message});
  //     }
      // If there is no existing user, hash the password
    //   return User.hashPassword(password);
    // })
    // .then(hash => {
    //   return User.create({
    //     username,
    //     password: hash,
    //     firstName,
    //     lastName
    //   });
    // })
    // .then(user => {
    //   return res.redirect('/jokes/users/' + user._id);
    // })
    // .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
    //   if (err.reason === 'ValidationError') {
    //     return res.status(err.code).json(err);
    //   }
    //   const message = "Internal server error";
    //   return res.render('errorMessage', {error: message});
    // });
});



// Post to register a new user
router.post('/login',(req, res) => {
  
  // check if username and password present
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));
    if (missingField) {
      const message = "Username and password are both required.";
      return res.render('errorMessage', {error: message});
  }

//check that all the fields are strings
  const stringFields = ['username', 'password', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    let error = 'Incorrect field type: expected string';
    return res.status(422).render('errorMessage', { error: error });
  }
  // If the username and password aren't trimmed we give an error.  Users might
  // expect that these will work without trimming (i.e. they want the password
  // "foobar ", including the space at the end).  We need to reject such values
  // explicitly so the users know what's happening, rather than silently
  // trimming them and expecting the user to understand.
  // We'll silently trim the other fields, because they aren't credentials used
  // to log in, so it's less of a problem.
  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    let error = 'Cannot start or end with whitespace';
    return res.status(422).render('errorMessage', { error: error });
  }
// check that username and password are the correct length
  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 5,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
      max: 15
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
   let error = "Password should be between 5 and 15 characters.";
   
    return res.status(422).render('errorMessage', { error: error });
  }


  let {username, password} = req.body;
  
  return User.findOne({username})
    .then(user => {
      if (user && user.validatePassword(password)) {   
        return res.redirect('/jokes/users/' + user._id);
      } 
      else {
        return res.redirect('/jokes/login');
      }
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/jokes');
});


module.exports = {router};
