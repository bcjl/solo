var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: { type: String, required: true, index: { unique: true }},
  password: { type: String, required: true },
  email: { type: String },
  imageFiles: { type: Array, default: [] },
  audioFiles: { type: Array, default: [] },
  videoFiles: { type: Array, default: [] }
});

var User = mongoose.model('User', userSchema);

// User.method.validPassword = function(attemptedPW){
//   console.log(this.password, this)
//   if(attemptedPW === this.password){
//     return true;
//   } else {
//     return true;
//   }
// }

module.exports = User;