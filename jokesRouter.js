const express = require('express'),
  expressSanitizer = require('express-sanitizer'),
  methodOverride = require('method-override'),
  bodyParser = require('body-parser'),
  jsonParser = bodyParser.json(),
  mongoose = require('mongoose'),
  router = express.Router(),
  { Joke } = require('./models'),
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
      res.status(500).render({ error: error });
    });
});

// LogIn Route redirects to login page
router.get('/login', (req, res) => {
  res.render('login');
});

// NEW Route redirects to form to enter new joke
router.get('/new', (req, res) => {
  res.render('new');
});

// CREATE Route
router.post('/', (req, res) => {
  let newJoke = {
    title: req.body.title,
    content: req.body.content,
    // image: req.body.image || '/images/default-img.jpeg'
    image: req.body.image
  };
  req.body = req.sanitize(req.body);
  Joke.create(newJoke, function(err, newJoke) {
    if (err) {
      console.log('Error from Joke.create', err);
      res.render('new');
    } else {
      res.redirect('/jokes');
    }
  });
});

// //SHOW Route
// router.get('/:id', function(req, res) {
//   Joke.findById(req.params.id, function(err, foundJoke) {
//     if (err) {
//       console.log('Error from Blog.create');
//       res.redirect('/jokes');
//     } else {
//       res.render('show', { joke: foundJoke });
//     }
//   });
// });

// EDIT Route redirects to edit joke page
router.get('/:id/edit', (req, res) => {
  Joke.findById(req.params.id)
    .then(joke => res.render('edit', { joke: joke }))
    .catch(err => {
      console.log(err);
      res.status(500).render({ error: error });
    });
});

// UPDATE Route
router.put('/:id', (req, res) => {
  // req.body = req.sanitize(req.body);

  // if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
  //   const message = `Request path id (${req.params.id}) and request body id ` + `(${req.body.id}) must match`;
  //   console.error(message);
  //   return res.status(400).render({ error: message });
  // }
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
    .catch(err => res.status(500).render({ error: error }));
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

module.exports = router;
