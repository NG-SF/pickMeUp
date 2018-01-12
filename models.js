'use strict';
const mongoose = require('mongoose');
const moment = require('moment');

mongoose.Promise = global.Promise;

// represents schema for blog posts
const jokeSchema = mongoose.Schema({
  title: String,
  content: { type: String, required: true },
  image: String,
  author: {
    firstName: String,
    lastName: String
  },
  created: { type: Date, default: Date.now() }
});

// virtual property to return full author name
jokeSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

// virtual property to return date formated with moment.js
jokeSchema.virtual('publishDate').get(function() {
  return moment(this.created).format('MMMM Do YYYY');
});

// instance method that returns blog posts in format that we want
jokeSchema.methods.serialize = function() {
  return {
    title: this.title,
    content: this.content,
    image: this.image,
    author: this.authorName,
    created: this.publishDate,
    id: this._id
  };
};

const Joke = mongoose.model('jokes', jokeSchema);
module.exports = { Joke };
