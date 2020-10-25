var express = require("express");
var router = express.Router();
var request = require("sync-request");
var mongoose = require("../models/connection");
const { MovieModel } = require("../models/movies");
require("dotenv").config();
var API_MOVIEDB = process.env.API_MOVIEDB;
/* GET home page. */
router.get("/", function (req, res, next) {
	res.render("index", { title: "Express" });
});

router.get("/new-movies", async function (req, res, next) {
	try {
		var result = await request(
			"GET",
			"https://api.themoviedb.org/3/discover/movie?api_key="+ API_MOVIEDB + "&language=fr-FR&sort_by=popularity.desc&include_adult=false&include_video=false&page=1"
		);
		var movies = JSON.parse(result.getBody());
	} catch (err) {
		console.error(err);
	}
	// result = JSON.parse(result);

	res.json({ movies });
});
// var error;

// ADD MOVIES
router.post("/wishlist-movie", async function (req, res, next) {
	console.log(req.body.name);
	console.log(req.body.img);
	try {
		var newMovie = await new MovieModel({
			title: req.body.name,
			image: req.body.img,
		});
		var movieSave = await newMovie.save();
	} catch (err) {
		console.error(err);
	}
	res.json({ result: true });
});

//DELETE MOVIES
router.delete("/movies/:name", async function (req, res, next) {
	try {
		var movies = await MovieModel.deleteOne({ title: req.params.name });
		console.log(movies);
	} catch (err) {
		console.error(err);
	}
	res.json({ result: true });
});

// GET LIST OF MOVIES

router.get("/wishlist-movie", async function (req, res, next) {
	try {
    var listMovies = await MovieModel.find();
		// var allMovies = JSON.parse(listMovies.getBody());
	} catch (err) {
		console.error(err);
	}
	res.json({ listMovies });
});

module.exports = router;
