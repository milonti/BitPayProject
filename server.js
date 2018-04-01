const express = require('express');
const app = express();
const port = 3000;

app.use((request,response, next) => {
  console.log(request.headers);
  next();
})

app.use((request, response, next) => {
  request.chance = Math.random();
  next();

})

app.get('/', (request, response) => {
  response.send('Hello user' + request.chance);
})

app.use((err, request, response, next) => {
  // log the error
  console.error(err);
  response.status(500).send('Error processing request');
})

app.listen(port, (err) => {
  console.log(`server listening on ${port}`);
})
