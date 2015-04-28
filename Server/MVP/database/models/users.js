var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: { type: String, required: true, index: { unique: true }},
  password: { type: String, required: true },
  email: { type: String },
  imageFiles: { type: Array, default: [] },
  audioFiles: { type: Array, default: [] }
});

var User = mongoose.model('User', userSchema);

module.exports = User;