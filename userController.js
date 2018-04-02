const User = require("./models.js").User;
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

exports.createNewUser = (request, response) => {
  //Pull specific information
  //Helps null check and prevents adding extra info into mongo doc
  var data = {
    username: request.body.username,
    password: request.body.password
  }
  if(data.username == null || data.username == undefined){
    response.status(500).send('No username in payload');
  }
  if(request.body.password == null || request.body.password == undefined){
    response.status(500).send('No password in payload');
  }
  if(request.body.key){
    data.publicKey = request.body.key;
  }
  let newUser = new models.User(data);
  newUser.save((err,user) =>{
    if(err){
      response.status(500).send(err);
    }
    else{
      response.status(200).send('Successfully created user '+user.username );
    }
  })
};

exports.loginUser = (request, response) => {
  //simplify the payload check
  if(request.body.username && request.body.password){
    var user = {
      username: request.body.username,
      password: request.body.password
    }
    User.authenticate(user, function(err, user){
      if(err){
        next(err);
      }
      else{
        response.status(200).send('You have succesfully logged in user: ' + user.username);
      }
    })
  }
}
