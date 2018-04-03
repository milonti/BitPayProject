const express = require('express');
const models = require('../mongo/models');
const bodyParser = require('body-parser');
const openpgp = require('openpgp');
openpgp.initWorker({path: 'openpgp.worker.js'});
openpgp.config.aead_protect = true;
const helmet = require('helmet');
const validator = require('validator');
const userController = require("./userController.js");
//Connect to mongoDB cloud instance
require("../config/db");

const app = express();
const port = 3000;

app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use((request, response, next) => {
  var keys = Object.keys(request.body);
  for(var key in keys){
    request.body[keys[key]] = validator.stripLow(request.body[keys[key]],true);
    //Keys require HTML characters to not be escaped
    if(keys[key] != 'message') request.body[keys[key]] = validator.escape(request.body[keys[key]]);
  }
  next();
})
//Basic get response
// app.get('/*', (request, response) => {
//   response.send('Hello user ' + request.chance);
// })
//Basic post response
// app.post('/', (request, response) => {
//   response.send(request.body);
// })

//Basic test creation
// app.post('/newStuff',(request, response) => {
//   var stuffName = request.body.username;
//   if(stuffName == null || stuffName == undefined){
//     response.status(500).send('No username found');
//   }
//   let newstuff = new models.Stuff(request.body);
//   newstuff.save((err, stuff) =>{
//     if(err){
//       response.status(500).send(err);
//     }
//     else{
//       response.status(200).json(stuff);
//     }
//   })
// })

// app.post('/newUser', userController.createNewUser);
// app.post('/authUser',userController.loginUser);
app.post('/insertUserKey', userController.insertUserKey);
app.post('/insertSignedMessage', userController.insertSignedMessage);

//Debug method for generating and storing RSA keypairs
//Realistically, you'd authenticate too here
//Skipped because I just need the keys to sign messages
// app.post('/generateRsaKeyPair',(request, response) =>{
//
//   if(request.body.username && request.body.passphrase){
//     var userdata = {
//       username: request.body.username,
//       passphrase: request.body.password
//
//     };
//     var options = {
//       userIds : [{ username: userdata.username}],
//       passphrase : userdata.passphrase
//     };
//     openpgp.generateKey(options).then(function(key){
//       var privkeyarm = key.privateKeyArmored;
//       var publkeyarm = key.publicKeyArmored;
//       console.log('privateKeyArmored:\n'+privkeyarm);
//       console.log('publicKeyArmored:\n'+publkeyarm);
//       var respStr = 'privateKeyArmored:\n'+privkeyarm;
//       respStr +='publicKeyArmored:\n'+publkeyarm;
//       models.User.update({username: userdata.username}, {publicKey: publkeyarm},{},function(err,num){
//           response.status(200).send(respStr);
//       });
//     });
//   }
//   else response.status(500).send('No username/passphrase');
// });

//Used this to insert a generated keypair and insert a message
//as part of a test
// app.post('/testInsertSigned',(request, response) =>{
//   var data = {
//     username : request.body.username,
//     password : request.body.password,
//     privkey : request.body.privkey,
//     pubkey : request.body.pubkey
//   }
//   var privKeyObj = openpgp.key.readArmored(data.privkey).keys[0];
//   var cleartext;
//   var options = {
//     data : 'Here is a message to sign!',
//     privateKeys : [privKeyObj]
//   }
//   openpgp.sign(options).then(function(signed){
//     cleartext = signed.data;
//     console.log(cleartext);
//     request.body.message = cleartext;
//     userController.insertSignedMessage(request,response);
//   })
// })

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
