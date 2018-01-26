require('dotenv').config();
const express = require('express'),
      mongoose = require('mongoose'),
      morgan = require('morgan'),
      passport = require('passport'),
      { router: jokesRouter} = require('./jokes'),
      { PORT, DATABASE_URL } = require('./config'),
      { router: usersRouter } = require('./users'),
      app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(morgan('common'));

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

app.use('/jokes', jokesRouter);
app.use('/users', usersRouter);

// Homepage Route
app.get('/', function(req, res) {
  res.render('index');
});

// LogIn Route redirects to login page
app.get('/login', (req, res) => {
  res.render('login');
});

// SignUp Route redirects to sign-up page
app.get('/signUp', (req, res) => {
  res.render('signUp');
});

app.use('*', (req, res) => {
  let message = 'Page Not Found';
  return res.status(404).render('errorMessage', { error: message });
});

let server;

// this function starts the server.
// it is also used in integration tests.
function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// this function closes the server, and returns a promise.
// it is also used in integration tests.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly, this block
// runs. Export runServer command for testing
if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
