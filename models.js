const mongoose = require("mongoose");
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
  publicKey: String

});
var User = mongoose.model('User', userSchema);

//Simple mongo schema for testing stuff
var stuffSchema = new Schema({
    name : {
      type: String,
      unique: true,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
})
var Stuff = mongoose.model('Stuff', stuffSchema);

module.exports = {User: User, Stuff: Stuff};
