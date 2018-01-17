const bcrypt = require('bcryptjs'),
      passportLocalMongoose = require('passport-local-mongoose'),
      mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    // required: true
  },
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''}
});


// UserSchema.methods.validatePassword = function(password) {
//   return bcrypt.compare(password, this.password);
// };

// UserSchema.statics.hashPassword = function(password) {
//   return bcrypt.hash(password, 10);
// };

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);

module.exports = { User };
