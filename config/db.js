const mongoose = require("mongoose");

const uri = "mongodb://server:ServerTokenStealth@bitpaycodechallenge-shard-00-00-sw9gb.mongodb.net:27017,bitpaycodechallenge-shard-00-01-sw9gb.mongodb.net:27017,bitpaycodechallenge-shard-00-02-sw9gb.mongodb.net:27017/test?ssl=true&replicaSet=BitPayCodeChallenge-shard-0&authSource=admin"

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10
}

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
