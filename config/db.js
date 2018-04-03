const mongoose = require("mongoose");
envVariables = require("./envVariables.js");

const uri = envVariables.mongoConnStr;

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10
}
//Connects to mongoDB cloud instance
mongoose.connect(uri, options).then(
  () => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);

// require any models
require("../mongo/models");
