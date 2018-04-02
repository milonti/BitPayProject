const express = require('express');
const models = require('./models');
const bodyParser = require('body-parser');
const openpgp = require('openpgp');
openpgp.initWorker({path: 'openpgp.worker.js'});
openpgp.config.aead_protect = true;
const userController = require("./userController.js");
//Connect to mongoDB cloud instance
require("./config/db");

const app = express();
const port = 3000;

app.use((request,response, next) => {
  console.log("");
  console.log(request.url);
  next();
})

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Basic get response
app.get('/*', (request, response) => {
  response.send('Hello user ' + request.chance);
})
//Basic post response
app.post('/', (request, response) => {
  response.send(request.body);
})

//Basic test creation
app.post('/newStuff',(request, response) => {
  var stuffName = request.body.username;
  if(stuffName == null || stuffName == undefined){
    response.status(500).send('No username found');
  }
  let newstuff = new models.Stuff(request.body);
  newstuff.save((err, stuff) =>{
    if(err){
      response.status(500).send(err);
    }
    else{
      response.status(200).json(stuff);
    }
  })
})

app.post('/newUser', userController.createNewUser);
app.post('/authUser',userController.loginUser);
app.post('/insertUserKey', userController.insertUserKey);
app.post('/insertSignedMessage', userController.insertSignedMessage);

//Debug method for generating and storing RSA keypairs
//Realistically, you'd authenticate too here
//Skipped because I just need the keys to sign messages
app.post('/generateRsaKeyPair',(request, response) =>{

  if(request.body.username && request.body.passphrase){
    var userdata = {
      username: request.body.username,
      passphrase: request.body.password

    };
    var options = {
      userIds : [{ username: userdata.username}],
      passphrase : userdata.passphrase
    };
    openpgp.generateKey(options).then(function(key){
      var privkeyarm = key.privateKeyArmored;
      var publkeyarm = key.publicKeyArmored;
      console.log('privateKeyArmored:\n'+privkeyarm);
      console.log('publicKeyArmored:\n'+publkeyarm);
      var respStr = 'privateKeyArmored:\n'+privkeyarm;
      respStr +='publicKeyArmored:\n'+publkeyarm;
      models.User.update({username: userdata.username}, {publicKey: publkeyarm},{},function(err,num){
          response.status(200).send(respStr);
      });
    });
  }
  else response.status(500).send('No username/passphrase');
})

app.use((err, request, response, next) => {
  // log the error
  console.error(err);
  response.status(500).send('Error processing request');
})

app.listen(port, (err) => {
  if(err){
    console.log(err)
  }
  console.log(`server listening on ${port}`);
})
