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

// INDEX Route
router.get('/', function(req, res) {
  Joke.find()
    .then(jokes => {
      res.render('index', { jokes: jokes });
    })
    .catch(err => {
      console.error(err);
      res.status(500).render('errorMessage', { error: error });
    });
});

// LogIn Route redirects to login page
router.get('/login', (req, res) => {
  res.render('login');
});

// LogIn Route redirects to login page
router.get('/signUp', (req, res) => {
  res.render('signUp');
});

// NEW Route redirects to form to enter new joke
router.get('/users/new/:id', (req, res) => {
  res.render('newJoke');
});

// CREATE Route
router.post('/users/:id', (req, res) => {
  let newJoke = {
    title: req.body.title,
    content: req.body.content,
    // image: req.body.image || '/images/default-img.jpeg'
    image: req.body.image
  };
  req.body = req.sanitize(req.body);
  
  User.findById(req.params.id)
  .then(user => {
    Joke.create(newJoke)
    .then(joke => {
      console.log(joke);
    })
    .then(() => {
      Joke.findById({userId: user._id})
      .then(jokes => {
        res.render('userPage', { jokes: jokes, user: user });
      });
    });
  }).catch(err => {
      console.error(err);
      let error = 'There are some problems with creating new joke';
      res.status(500).render('errorMessage', { error: error });
    });

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

// EDIT Route redirects to edit joke page
router.get('/:id/edit', (req, res) => {
  Joke.findById(req.params.id)
    .then(joke => res.render('edit', { joke: joke }))
    .catch(err => {
      console.log(err);
      res.status(500).render('errorMessage', { error: error });
    });
});

// UPDATE Route
router.put('/:id', (req, res) => {
  // req.body = req.sanitize(req.body);

  const toUpdate = {};
  const updatableFields = ['title', 'content', 'image'];
  console.log(req.body);

  updatableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Joke.findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(joke => {
      res.status(204);
      res.redirect('/jokes');
    })
    .catch(err => res.status(500).render('errorMessage', { error: error }));
});

// DELETE Route
router.delete('/:id', (req, res) => {
  Joke.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.log('Error from delete route');
      res.redirect('/jokes');
    } else {
      res.redirect('/jokes');
      console.log('deleted joke');
    }
  });
});

module.exports = { router };
