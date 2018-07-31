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

mongoose.Promise = global.Promise;

app.set('view engine', 'ejs');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(expressSanitizer());
router.use(express.static('public'));
router.use(methodOverride('_method'));

// generic error message
let error = 'Sorry. Something went wrong on the server side.';

// NEW Route redirects to form to enter new joke
router.get('/users/new/:id', (req, res) => {
  res.render('newJoke', {id: req.params.id});
});

//SHOW Route
router.get('/users/:id', (req, res) => {
  const perPage = 6;
  let pageQuery = parseInt(req.query.page);
  let pageNumber = pageQuery ? pageQuery : 1;
  User.findById(req.params.id)
  .then(user => {

  Joke.find({userId: user._id})
    .skip((perPage * pageNumber) - perPage)
    .limit(perPage)
    .then(jokes => {
      Joke.find({userId: user._id})
      .count()
      .then(count => {
          res.render('userPage', { 
            jokes: jokes, 
            user: user,
            current: pageNumber,
            pages: Math.ceil(count / perPage) 
          });
      });
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
  //to remove script tags from user input, in case he tries to 
  //enter them
  req.body = req.sanitize(req.body);

  Joke.create(newJoke)
  .then(joke => {

    Joke.find({userId: newJoke.userId})
    .then(jokes => {
        res.redirect('/jokes/users/' + newJoke.userId);
      }); 
    }).catch(err => {
      console.error(err);
      let error = "Sorry, cannot find jokes";
      res.status(500).render('errorMessage', { error: error });
    });
});

// EDIT Route redirects to edit joke page
router.get('/users/edit/:id/:userId', (req, res) => {
  let id = req.params.userId;
  Joke.findById(req.params.id)
    .then(joke => res.render('edit', { joke: joke, userId: id}))
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
  //to remove script tags from user input, in case he tries to 
  //enter them
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
