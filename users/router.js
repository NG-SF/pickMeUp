const express = require('express'),
      bodyParser = require('body-parser'),
      { User } = require('./models'),
      router = express.Router(),
      jsonParser = bodyParser.json();

router.use(bodyParser.urlencoded({ extended: true }));

// Post to register a new user
router.post('/create',(req, res) => {
  
  // check if username and password is defined
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));
    if (missingField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Missing field',
    });
  }

  // If the username and password aren't trimmed we give an error
  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
  return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

// check that username and password are the correct length
  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 5,
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
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField ? `Must be at least ${sizedFields[tooSmallField].min} characters long` : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {username, password, firstName = '', lastName = ''} = req.body;
  // Username and password come in pre-trimmed, otherwise we throw an error
  // before this
  firstName = firstName.trim();
  lastName = lastName.trim();

  return User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash,
        firstName,
        lastName
      });
    })
    .then(user => {
      return res.redirect('/jokes/users/' + user._id);
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      const message = "Internal server error";
      return res.render('errorMessage', {error: message});
    });
});

// Post to register a new user
router.post('/login',(req, res) => {
  
  // check if username and password present
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));
    if (missingField) { 
      return res.status(403).json({code: 403, message: "Username and password are both required."});
  }

const explicityTrimmedFields = ['username', 'password'];
const nonTrimmedField = explicityTrimmedFields.find(
  field => req.body[field].trim() !== req.body[field]);

if (nonTrimmedField) {
  let error = 'Cannot start or end with whitespace';
  return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  let {username, password} = req.body;
  
  return User.findOne({username})
    .then(user => {
      if (user && user.validatePassword(password)) {   
        return res.redirect('/jokes/users/' + user._id);
      } 
      else {
        return res.redirect('/login');
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

module.exports = {router};
