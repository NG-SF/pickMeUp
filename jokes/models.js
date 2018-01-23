const mongoose = require('mongoose'),
      moment = require('moment');

mongoose.Promise = global.Promise;

const jokeSchema = mongoose.Schema({
  title: { type: String, required: false },
  content: String,
  image: String,
  created: { type: Date, default: Date.now() },
  userId: String
});

// virtual property to return date formated with moment.js
jokeSchema.virtual('publishDate').get(function() {
  return moment(this.created).format('MMMM Do YYYY');
});

const Joke = mongoose.model('jokes', jokeSchema);

module.exports = { Joke };
