import React, { useState, useEffect } from "react";
import "./App.css";
import {
	Container,
	Row,
	Button,
	Nav,
	NavItem,
	NavLink,
	Popover,
	PopoverHeader,
	PopoverBody,
	ListGroup,
	ListGroupItem,
	ListGroupItemText,
} from "reactstrap";

import Movie from "./components/Movie";

function App() {
	const [datasStatus, setdatasStatus] = useState([]);
	const [moviesCount, setMoviesCount] = useState(0);
	const [moviesWishList, setMoviesWishList] = useState([]);
	const [popoverOpen, setPopoverOpen] = useState(false);
	const toggle = () => setPopoverOpen(!popoverOpen);

	useEffect(() => {
		async function listMovies() {
			var rawResponse = await fetch("/new-movies");
			var response = await rawResponse.json();
			console.log(response.movies.results);
			setdatasStatus(response.movies.results);
			const responseWish = await fetch("wishlist-movie");
			const jsonResponseWish = await responseWish.json();
			console.log(jsonResponseWish);
			const wishlistFromDB = jsonResponseWish.listMovies.map((movie, i) => {
				return { name: movie.title, img: movie.image};
      });
			setMoviesWishList(wishlistFromDB);
      setMoviesCount(jsonResponseWish.listMovies.length);
      // console.log(wishlistFromDB);
      
		}
		// console.log(wishlistFromDB);
		listMovies();
	}, []);

	var handleClickAddMovie = async (name, img) => {
		setMoviesCount(moviesCount + 1);
		setMoviesWishList([...moviesWishList, { name: name, img: img }]);

		await fetch("/wishlist-movie", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: `name=${name}&img=${img}`,
		});
	};

	var handleClickDeleteMovie = async (name) => {
		setMoviesCount(moviesCount - 1);
		setMoviesWishList(moviesWishList.filter((object) => object.name != name));

		await fetch(`/movies/${name}`, {
			method: "DELETE",
		});
	};

	// console.log(wishResponse.listMovies);
	var cardWish = moviesWishList.map((movie, i) => {
		return (
			<ListGroupItem>
				<ListGroupItemText
					onClick={() => {
						handleClickDeleteMovie(movie.name);
					}}
				>
					<img
						width="50%"
						src={"https://image.tmdb.org/t/p/w500" + movie.img}
					/>{" "}
					{movie.name}
				</ListGroupItemText>
			</ListGroupItem>
		);
	});
	var movieList = datasStatus.map((movie, i) => {
		var result = moviesWishList.find((element) => element.name == movie.original_title);
		// console.log("c'est le result = " + result);
		var isSee = false;
		if (result != undefined) {
			isSee = true;
		}
		console.log(isSee);
		var urlImage = "/generique.jpg";
		if (movie.backdrop_path != null) {
			urlImage = "https://image.tmdb.org/t/p/w500/" + movie.backdrop_path;
    }
		return (
			<Movie
				key={i}
				movieSee={isSee}
				handleClickDeleteMovieParent={handleClickDeleteMovie}
				handleClickAddMovieParent={handleClickAddMovie}
				movieName={movie.original_title}
				movieDesc={movie.overview}
				movieImg={movie.backdrop_path}
				globalRating={movie.vote_average}
				globalCountRating={movie.vote_count}
			/>
		);
	});

	return (
		<div style={{ backgroundColor: "#232528" }}>
			<Container>
				<Nav>
					<span className="navbar-brand">
						<img
							src="./logo.png"
							width="30"
							height="30"
							className="d-inline-block align-top"
							alt="logo"
						/>
					</span>
					<NavItem>
						<NavLink style={{ color: "white" }}>Last Releases</NavLink>
					</NavItem>
					<NavItem>
						<NavLink>
							<Button id="Popover1" type="button">
								{moviesCount} films
							</Button>
							<Popover
								placement="bottom"
								isOpen={popoverOpen}
								target="Popover1"
								toggle={toggle}
							>
								<PopoverHeader>WishList</PopoverHeader>
								<PopoverBody>
									<ListGroup>{cardWish}</ListGroup>
								</PopoverBody>
							</Popover>
						</NavLink>
					</NavItem>
				</Nav>
				<Row>{movieList}</Row>
			</Container>
		</div>
	);
}

export default App;
