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

// INDEX Route
router.get('/', function(req, res) {
  Joke.find({}, function(err, jokes) {
    if (err) {
      console.log('Error!');
    } else {
      res.render('index', { jokes: jokes });
    }
  });
});
//NEW Route
router.get('/new', function(req, res) {
  res.render('new');
});

// CREATE Route
router.post('/', function(req, res) {
  console.log('this is title', req.body.title);
  console.log('this is content', req.body.content);
  let newJoke = {
    title: req.body.title,
    content: req.body.content,
    image: req.body.image
  };
  // req.body.joke.body = req.sanitize(req.body.joke.body);
  Joke.create(newJoke, function(err, newJoke) {
    if (err) {
      console.log('Error from Joke.create', err);
      res.render('new');
    } else {
      res.redirect('/jokes');
    }
  });
});

//SHOW Route
router.get('/:id', function(req, res) {
  Joke.findById(req.params.id, function(err, foundJoke) {
    if (err) {
      console.log('Error from Blog.create');
      res.redirect('/jokes');
    } else {
      res.render('show', { joke: foundJoke });
    }
  });
});

// // EDIT Route
// router.get('/:id/edit', function(req, res) {
//   Blog.findById(req.params.id, function(err, foundBlog) {
//     if (err) {
//       console.log('Error from edit route');
//       res.redirect('/blogs');
//     } else {
//       res.render('edit', { blog: foundBlog });
//     }
//   });
// });
//
// // UPDATE Route
// router.put('/:id', function(req, res) {
//   req.body.blog.body = req.sanitize(req.body.blog.body);
//   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
//     if (err) {
//       res.redirect('/blogs');
//     } else {
//       res.redirect('/blogs/' + req.params.id);
//     }
//   });
// });
//
// DELETE Route
router.delete('/:id', function(req, res) {
  Joke.findByIdAndRemove(req.params.id, function(err) {
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
