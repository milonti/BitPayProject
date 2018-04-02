const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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

//Set up auto-hashing before saving to Database
//Always happens upon creation of the model
userSchema.pre('save',function(next){
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash){
    if(err){
      //Passes error up a level
      return next(err);
    }
    user.password = hash;
    next();
  });
});

//Set up authentication against Database password
userSchema.statics.authenticate = function(username, password, callback) {
  User.findOne({username: username}).exec(function (err, user) {
    if(err){
      return callback(err);
    }
    else if(!user) {
      //Handle not finding user, which is not a database error
      var err = new Error('User not found');
      err.status = 401;
      return callback(err);
    }
    bcrypt.compare(password, user.password, function(err, result){
      if( result === true){
        return callback(null, user);
      }
      else{
        return callback();
      }
    })
  })
}

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
