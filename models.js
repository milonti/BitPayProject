var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//Simple mongo schema for user. Needs username and password, sets up for key later
var userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  keyInfo: String

});
var User = mongoose.model('User', userSchema);
module.exports = User;
