var mongoose = require("mongoose");
require("dotenv").config();

var MONGODB_USERNAME = process.env.MONGODB_USERNAME;
var MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;

var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.connect(
  "mongodb+srv://" + MONGODB_USERNAME + ":" + MONGODB_PASSWORD + "@clustercw.thdom.mongodb.net/mymovizapp?retryWrites=true&w=majority",
  options,
  function (err) {
    if (err) {
      throw err;
    } else {
      console.log("successfully connected to the database");
    }
  }
);
module.exports = { mongoose, options };
