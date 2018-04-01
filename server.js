const express = require('express');
const models = require('./models');
const bodyParser = require("body-parser");
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

//Basic new user creation
app.post('/newUser',(request, response,err) => {
  if(err){
    console.log('yo')
  }
  var stuffName = request.body.username;
  if(stuffName == null || stuffName == undefined){
    response.status(500).send('No username found');
  }
  let newstuff = new models.Stuff({name: stuffName});
  newstuff.save((err, stuff) =>{
    if(err){
      response.send(500).send(err);
    }
    response.status(200).json(stuff).send();
  })
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
