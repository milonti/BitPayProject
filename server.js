const express = require('express');
const expApp = express();
const port = 3000;

app.get('/', (request, response) => {
  response.send('Hello user');
})

app.listen(port, (err) => {
  if(err){
    return console.log('Error starting server:', err);
  }

  console.log(`server listening on ${port}`);
})
