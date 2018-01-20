const express = require('express'),
  expressSanitizer = require('express-sanitizer'),
  methodOverride = require('method-override'),
  bodyParser = require('body-parser'),
  jsonParser = bodyParser.json(),
  mongoose = require('mongoose'),
  router = express.Router(),
  { Joke } = require('./models'),
  { User } = require('../users/models'),
  app = express();
// App config

mongoose.Promise = global.Promise;
app.set('view engine', 'ejs');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(expressSanitizer());
router.use(express.static('public'));
router.use(methodOverride('_method'));
router.use(bodyParser.json());

// generic error message
let error = 'Sorry. Something went wrong on the dark side.';

// Homepage Route
router.get('/', function(req, res) {
  res.render('index');
});

// LogIn Route redirects to login page
router.get('/login', (req, res) => {
  res.render('login');
});

// SignUp Route redirects to sign-up page
router.get('/signUp', (req, res) => {
  res.render('signUp');
});

// NEW Route redirects to form to enter new joke
router.get('/users/new/:id', (req, res) => {
  res.render('newJoke', {id: req.params.id});
});

//SHOW Route
router.get('/users/:id', (req, res) => {
  User.findById(req.params.id)
  .then(user => {

  Joke.find({userId: user._id})
    .then(jokes => {
      res.render('userPage', { jokes: jokes, user: user });
    });  
  }).catch(err => {
      console.error(err);
      res.status(500).render('errorMessage', { error: error });
    });

});

// CREATE Route
router.post('/users/:id', (req, res) => {
  
  let newJoke = {
    title: req.body.title,
    content: req.body.content,
    image: req.body.image,
    userId: req.params.id
  };
  req.body = req.sanitize(req.body);

    Joke.create(newJoke)
    .then(joke => {
      User.findById(req.params.id)
      .then(user => {
        Joke.find({userId: user._id})
        .then(jokes => {
          res.render('userPage', { jokes: jokes, user: user });
        }); 
      });
    }).catch(err => {
      console.error(err);
      let error = "Cannot find jokes";
      res.status(500).render('errorMessage', { error: error });
    });
});

// EDIT Route redirects to edit joke page
router.get('/users/edit/:id', (req, res) => {
  Joke.findById(req.params.id)
    .then(joke => res.render('edit', { joke: joke }))
    .catch(err => {
      console.log(err);
      res.status(500).render('errorMessage', { error: error });
    });
});

// UPDATE Route
router.put('/users/:id', (req, res) => {

  const toUpdate = {};
  const updatableFields = ['title', 'content', 'image'];
  console.log(req.body);

  updatableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });
  req.body = req.sanitize(req.body);

  Joke.findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(joke => {
      res.status(204);
      const userId = joke.userId;
      res.redirect('/jokes/users/' + userId);
    })
    .catch(err => res.status(500).render('errorMessage', { error: error }));
});

// DELETE Route
router.delete('/users/:id', (req, res) => {
  let error = 'Server error happened while trying to delete a joke';
  
 Joke.findById(req.params.id)
 .then(joke => {
    const userId = joke.userId;
   Joke.findByIdAndRemove(req.params.id)
  .then( () => {
      res.redirect('/jokes/users/' + userId);
    });
 })
  .catch(err => {
      console.error(err);
      res.status(500).render('errorMessage', { error: error });
    }); 
});

module.exports = { router };
