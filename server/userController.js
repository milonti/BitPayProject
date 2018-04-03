const User = require("../mongo/models.js").User;
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const openpgp = require("openpgp");

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
    User.authenticate(user.username, user.password, function(err, user){
      if(err){
        next(err);
      }
      else{
        if(user)response.status(200).send('You have succesfully logged in user: ' + user.username);
        else response.status(401).send('Failed to authenticate user');
      }
    })
  }
}

exports.insertUserKey = (request, response) => {
  //authenticate first
  if(request.body.username && request.body.password
  && request.body.key){
    var userdata = {
      username: request.body.username,
      password: request.body.password,
      publicKey: request.body.key
    }
    //Only the user can input their message
    User.authenticate(userdata.username, userdata.password, function(err,user){
      if(err){
        next(err);
      }
      else{
        if(user){
          User.update({username: userdata.username},{userMessage: userdata.publicKey }, {}, function(err, num){
            if(err){
              response.status(500).send(err);
            }
            else if(num.nModified > 0){ //Easy check for how many objects were modified
              response.status(200).send(userdata.username + ' updated public key:\n' + userdata.publicKey);
            }
            else {
              response.status(200).send('No users found to update (how did you manage to authenticate?)');
            }
          })
        }
        else response.status(401).send('Failed to authenticate user');
      }
    })
  }
}

exports.sendEncodedMessage = (request, response) =>{
  //authenticate first
  if(request.body.username && request.body.password
  && request.body.message){
    var userdata = {
      username: request.body.username,
      password: request.body.password,
      userMessage: request.body.message
    }
    //Only the user can read their own message
    //Even though we're encrypting it, might as well use password too
    User.authenticate(userdata.username, userdata.password, function(err,user){
      if(err){
        next(err);
      }
      else{
        if(user){
          //If user has not set up a key, they cannot retrieve encoded messages
          if(user.publicKey){

          }
          else response.status(405).send('No public key associated with' + user.username + '. Encryption could not occur.');
        }
        else response.status(401).send('Failed to authenticate user');
      }
    })
  }
}

exports.insertSignedMessage = (request, response) => {
  //authenticate first
  if(request.body.username && request.body.password
  && request.body.message){
    var userdata = {
      username: request.body.username,
      password: request.body.password,
      userMessage: request.body.message
    }
    //Only the user can read their own message
    //Even though we're encrypting it, might as well use password too
    User.authenticate(userdata.username, userdata.password, function(err,user){
      if(err){
        next(err);
      }
      else{
        if(user){
          //If user has not set up a key, they cannot store encoded messages
          if(user.publicKey){
            var options;
            try{
              options = {
                message: openpgp.cleartext.readArmored(userdata.userMessage),
                publicKeys : openpgp.key.readArmored(user.publicKey).keys
              }
            }
            catch (e){
              response.status(500).send("Malformed data encountered by openpgp: " + e);
              return;
            }


            openpgp.verify(options).then(function(verified){
              valid = verified.signatures[0].valid;
              if(valid){
                //If verification succeeds add message to database
                User.update({username: userdata.username},{userMessage: userdata.userMessage }, {}, function(err, num){
                  if(err){
                    response.status(500).send(err);
                  }
                  else if(num.nModified > 0){ //Easy check for how many objects were modified
                    response.status(200).send(userdata.username + ' updated personal signed message:\r\n' + userdata.userMessage);
                  }
                  else {
                    response.status(200).send('No users found to update (how did you manage to authenticate?)');
                  }
                })
              }
            });
          }
          else response.status(405).send('No public key associated with' + user.username + '. Encryption could not occur.');
        }
        else response.status(401).send('Failed to authenticate user');
      }
    })
  }
}
