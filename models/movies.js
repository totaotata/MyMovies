var mongoose = require("mongoose");

var MovieSchema = mongoose.Schema({
    title: String,
    image: String
})

var MovieModel = mongoose.model("movies", MovieSchema);
module.exports = { mongoose, MovieModel};