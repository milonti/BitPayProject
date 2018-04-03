//These are meant to be environment variables set on the server machine
//They would then be loaded into the application via this file
exports.connectionString = process.env.MONGO_DB_CONN_STR;

//I have explicitly set the variables actually used below
exports.mongoConnStr = "mongodb://server:ServerTokenStealth@bitpaycodechallenge-shard-00-00-sw9gb.mongodb.net:27017,bitpaycodechallenge-shard-00-01-sw9gb.mongodb.net:27017,bitpaycodechallenge-shard-00-02-sw9gb.mongodb.net:27017/test?ssl=true&replicaSet=BitPayCodeChallenge-shard-0&authSource=admin"
