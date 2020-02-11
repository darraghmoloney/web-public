/*
	The main App file for the Cinemap app.
	This app shows different information about movies and actors,
	and has a quiz.
*/

import React, {Component} from 'react';
import {Nav} from './Nav';
import {MovieSearch} from './MovieSearch';
import {Start} from './Start';
import {Quiz} from './Quiz';
import {ActorSearch} from './ActorSearch';
import {Discover} from './Discover';
import {Login} from './Login';
import {OpenMovieDBKey} from './APIKeys';
import {TheMovieDBKey} from './APIKeys';
//import {Register} from './Register';

import {badQuotes} from './badquotes';

import './App.css';

//our app constructor class has a massive amount
//of state variables, due to design decisions that
//would be done differently if the app was started
//from scratch. lots of passing props to
//sub-components
class App extends Component {

	//create props to pass values
	//to child componenets
	constructor(props) {
		super(props);

		this.state = {

			movieListArray: [],		//hold basic detail about movies
			movieInfo: [],				//hold advanced detail about one
														//particular movie
			actorInfoArray: [],		//actor api details
			actorDetails: [],

			maxPagesMovieSearch: null,	//don't try to search past end of results

			discoveredMovies: [],	//holds list of current popular movies, etc

			//movie search, details api fetched successfully
			isFetched: false,
			detFetched: false,

			//actor search, details api fetched successfully
			actFetched: false,
			actDetFetched: false,

			//discovery movies fetched (trending movies)
			discoveredFetched: false,

			//holds error strings
			errorMsg: null,

			/*for navigation buttons*/
			navClicked: -1,
			previousPage: -1,

			/*for search box filtering*/
			searchedItem: "",
			titleSearch: "",
			currentPage: 1,
			currentActorPage: 1,

			actSearchMaxPages: null,

			searchedActor: "",
			actorSearch: "",

			//to get extra details about a given
			//actor
			actorID: "",

			//hold imdb ID of clicked movie
			//to send to API for further
			//information
			movieID: "",
			movieSearch: "",

			//for rendering extra details
			//in the actor and movie pages
			showDetails: false,
			showActDetails: false,
			showMovieSearchButtons: true,

			showCultHeroes: false,	//toggle button for extra feature

			isNextMovieSearchPage: false,	//sanity check for movie search

			frontPage: true,	//for splash screen

			loggedIn: false,	//this is not actually implemented to do anything

			searchFormErrors: {search: ""},

			searchValid: false,	//conditionally hide buttons until valid input





		};

		//would LOVE to re-factor this...
		this.onNavClick = this.onNavClick.bind(this);

		this.handleTextSearch = this.handleTextSearch.bind(this);
		this.handleActorSearch = this.handleActorSearch.bind(this);

		this.onSearchClick = this.onSearchClick.bind(this);
		this.onActorSearchClick = this.onActorSearchClick.bind(this);

		this.onNextPageClick = this.onNextPageClick.bind(this);
		this.onPrevPageClick = this.onPrevPageClick.bind(this);

		this.getMessage = this.getMessage.bind(this);

		this.onDetailClick = this.onDetailClick.bind(this);
		this.onDetailBackClick = this.onDetailBackClick.bind(this);

		this.onActorDetailClick = this.onActorDetailClick.bind(this);
		this.onDiscoverClick = this.onDiscoverClick.bind(this);

		this.onMovieBackClick = this.onMovieBackClick.bind(this);
		this.onActorDetailBackClick = this.onActorDetailBackClick.bind(this);

		this.onActorNextClick = this.onActorNextClick.bind(this);
		this.onActorPrevClick = this.onActorPrevClick.bind(this);

		this.onShowCultClick = this.onShowCultClick.bind(this);

		this.onShowCultBackClick = this.onShowCultBackClick.bind(this);
		this.onActorBackClick = this.onActorBackClick.bind(this);


	}

	//fetch general movie data from API
	//yes, this should really be called componentDidMount()
	//but it's too late now
	async titleAPIFetch() {
		try {
			//	let titleSearch = "Jurassic Park";
			let titleSearch = this.state.titleSearch;
			let currentPage = this.state.currentPage;
		  let API_URL = 'http://www.omdbapi.com/?apikey=' + OpenMovieDBKey + ' &type="movie"&page=' + currentPage + '&' + titleSearch;


			let response = await fetch(API_URL);
			let jsonResult = await response.json();



			this.setState({movieListArray: jsonResult});
			this.setState({isFetched: true});
			console.log("Successfully fetched movie title data from " + API_URL);
		}
		//if the data is not returned
		catch (error) {
			this.setState({isFetched: false});
			this.setState({errorMsg: error});
			console.log("Error: " + error);
		}
	}

	//fetch details about a specific movie
	async movieDetailAPIFetch() {
		try {
			//	let titleSearch = "Jurassic Park";
			let movieID = this.state.movieID;
			//let currentPage = this.state.currentPage;
			let API_URL = 'http://www.omdbapi.com/?apikey=' + OpenMovieDBKey + '&type="movie"&plot=full&y&i=' + movieID;


			let response = await fetch(API_URL);
			let jsonResult = await response.json();


			this.setState({movieInfo: jsonResult});
			this.setState({detFetched: true});
			console.log("Successfully fetched movie details from " + API_URL);
		}
		//if the data is not returned
		catch (error) {
			this.setState({detFetched: false});
			this.setState({errorMsg: error});
			console.log("Error: " + error);
		}
	}

	//for general actor searches - note it uses MovieDB API
	//in future, better to put these calls in a separate file!!
	async actorAPIFetch() {
		try {
		//	let actorSearch = "Jeff Goldblum";
			let actorSearch = this.state.actorSearch;
			let currentActorPage = this.state.currentActorPage;
			let API_URL = 'https://api.themoviedb.org/3/search/person?api_key=' + TheMovieDBKey + '&language=en-US&page=' + currentActorPage + '&include_adult=false&query="' + actorSearch + '"';

			let response = await fetch(API_URL);
			let jsonResult = await response.json();

				this.setState({actorInfoArray: jsonResult});
				this.setState({actFetched: true});

				let maxPages = jsonResult.total_pages;

				this.setState({actSearchMaxPages: maxPages});
				console.log("Successfully fetched actor data from " + API_URL);

		}
		//if the data is not returned
		catch (error) {
			this.setState({actFetched: false});
			this.setState({errorMsg: error});
			console.log("Error: " + error);
		}
	}

	//detailed bio search for actors
	async actorDetailFetch() {

		try {
			let actorID = this.state.actorID;

			//this API actor detail call also returns
			//relevant images and videos, if there are any
			let API_URL = 'https://api.themoviedb.org/3/person/' + actorID + '?api_key=' + TheMovieDBKey + '&language=en-US&append_to_response=videos,images';

			let response = await fetch(API_URL);
			let jsonResult = await response.json();

			this.setState({actorDetails: jsonResult});
			this.setState({actDetFetched: true});
			console.log("Fetched actor details from " + API_URL);

		}
		catch(error) {
			this.setState({actDetFetched: false});
			this.setState({errorMsg: error});
			console.log("Error: " + error);
		}
	}

	//an api call to look for popular movies etc
	async discoverMoviesFetch() {
		let API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=' + TheMovieDBKey + '';

		let response = await fetch(API_URL);
		let jsonResult = await response.json();

		this.setState({discoveredMovies: jsonResult});
		this.setState({discoveredFetched: true});
		console.log("Fetched movies to discover from " + API_URL);
	}

	//for changing main pages
	//get the number of the page from the
	//click, and change the global state
	//variable
	onNavClick(num) {
		this.setState({navClicked: num});
		console.log("Navigation button " + num + " clicked");
	}

	//boilerplate code for search form
	//validation. sets a boolean variable
	//that is used to disable search
	//buttons until valid input is provided
  validateSearch(searchText) {
    let localFormErrors = this.state.searchFormErrors;

		//check for too short queries, or anything
		//that isn't a regular letter/number character or a space
    if(searchText.length < 4) {
      localFormErrors.search = "Search is too short";
      this.setState({searchValid: false});

			//so this regex should mean only word characters or spaces
			//note: apostrophe character ' turns out to be important too...
    } else if( !(/^[\w\s']+$/.test(searchText))  ) {

      localFormErrors.search = "Search may not contain special characters";
      this.setState({searchValid: false});
    } else {
      localFormErrors.search = "";
      this.setState({searchValid: true});
    }

		//this is not currently used
		//might be nice to display it, too
    this.setState({searchFormErrors: localFormErrors});

    ;
  }

	//for text search box - movie title
	handleTextSearch(event) {
		event.preventDefault();

		//quick and simple Validation for movie
		//text title searches now included

		//Note - OpenMovieDB seems to have issues with
		//searches for brackets - possible security holes
		//(they didn't remember PETER'S LAWS of VALIDATION!!)
		this.setState({searchedItem: event.target.value});
		this.validateSearch(event.target.value);

		console.log("Search text " + this.state.searchedItem + " entered");
	}

	handleActorSearch(event) {
		event.preventDefault();

		//actor search text has validation
		//only normal text characters or numbers allowed (\w)
		this.setState({searchedActor: event.target.value});
		this.validateSearch(event.target.value);

		console.log("Search for actor " + this.state.searchedActor+ " entered");
	}

	//this is supposed to reload the information with
	//a new API call after a click on submit in
	//the title search
	onSearchClick() {

		//s= is for search, t= or i= for known title or imdb id for extra
		//information in OpenMovieDB API.
				//^this useful information was forgotten about and not used.
		this.setState({isFetched: false});
		this.setState({titleSearch: ""});
		this.setState({currentPage: 1});
		this.setState({showDetails: false})
		this.setState({showMovieSearchButtons: false})

		let titleToFind = 's=' + this.state.searchedItem;

		//note the titleAPIFetch call after the set state
		// - 1. change the search value in state
		// - 2. call the API again AFTER the state is changed
		//if this is not done, the order of loading is wrong and
		//the previous search items are loaded until the second click
		this.setState({titleSearch: titleToFind},this.titleAPIFetch);

		console.log("Search button clicked with query " +this.state.searchedItem);
	}

	onMovieBackClick() {
		this.setState({showMovieSearchButtons: true, showDetails: false});
		console.log("Movie search list back button clicked");
	}

	//handle the search for details about a movie
	onDetailClick(id) {
		this.setState({detFetched: false});

		this.setState({movieID: id, showDetails: true}, this.movieDetailAPIFetch);
		console.log("Movie details button clicked for movie ID " +this.state.movieID);
	}

	//need this to re-render the search results
	onDetailBackClick() {
		this.setState({showDetails: false});
		console.log("Clicked to close details page");
	}

	onActorSearchClick() {
		console.log("Loading actor search");
		this.setState({actFetched: false, showActDetails: false});
		this.setState({actorSearch: ""});


		let actorToFind = this.state.searchedActor;

		this.setState({actorSearch: actorToFind}, this.actorAPIFetch);

		console.log("Actor search button clicked with query " +this.state.searchedActor);
	}

	//handle extra details search for actor
	onActorDetailClick(id) {
		this.setState({actDetFetched: false});
		this.setState({actorDetails: []});

		this.setState({actorID: id, showActDetails: true}, this.actorDetailFetch);
		// this.setState({showCultHeroes: false});
		console.log("Actor details clicked for actor ID " + this.state.actorID);
	}

	onActorDetailBackClick() {
		this.setState({showActDetails: false});
		console.log("Actor details back button clicked");
	}

	onDiscoverClick() {
		console.log("Discover button clicked");
		this.setState({discoveredFetched: false, discoveredMovies: []});

		this.discoverMoviesFetch();
	}

	onNextPageClick() {
		console.log("Next button clicked");
		let nextPage = this.state.currentPage + 1;

		//could this be a state variable instead?
		let maxPage = Math.ceil(this.state.movieListArray.totalResults / 10);

		//NB current api is limited to 100 pages max
		if(nextPage <= maxPage) {
			this.setState({isFetched: false, isNextMovieSearchPage: true});
			this.setState({currentPage: nextPage}, this.titleAPIFetch);
			console.log("Loaded results page " + nextPage);
		} else {
			this.setState({isNextMovieSearchPage: false})
		}
	}

	onPrevPageClick() {
		console.log("Previous button clicked");
		let prevPage = this.state.currentPage - 1;

		//must have somewhere to move back to!!
		if(prevPage > 0) {
			this.setState({isFetched: false});
			this.setState({currentPage: prevPage}, this.titleAPIFetch);
			console.log("Loaded results page " + prevPage);
		}
	}

	onActorNextClick() {
		console.log("Actor search next button clicked");
		let nextPage = this.state.currentActorPage + 1;

		if(nextPage < this.state.actSearchMaxPages) {
			this.setState({actFetched: false});
			this.setState({currentActorPage: nextPage}, this.actorAPIFetch);
			console.log("Loaded actor results page " + nextPage);
		}

	}

	onActorPrevClick() {
		console.log("Actor search previous button clicked");
		let prevPage = this.state.currentActorPage - 1;

		if(prevPage > 0) {
			this.setState({actFetched: false});
			this.setState({currentActorPage: prevPage}, this.actorAPIFetch);
			console.log("Loaded actor results page " + prevPage);
		}
	}

	onActorBackClick() {
		console.log("Actor search back button clicked");
		this.setState({actFetched: false});
	}


  onShowCultClick() {
    console.log("Cult heroes button clicked");
    this.setState({showCultHeroes: true});
  }

	onShowCultBackClick() {
		console.log("Cult heroes back button clicked");
		this.setState({showCultHeroes: false});
	}

	//show a "funny" wrong quote on the homepage
	//this reloads every time state changes, should try to load it less
	//simple JSON array, not API - not a "serious" feature!
	getMessage() {

		//use a random number to get a quote
		let randNum = Math.floor(Math.random() * badQuotes.length);
	//	console.log("New quote generated");
		return(
			<div id="MovieQuote">
				"{badQuotes[randNum].quote}"
				<br/>
				<div id="MovieQuoteMovie">
				<em>- {badQuotes[randNum].movie}</em>
				</div>
			</div>
		);

	}

	render() {

		const navClicked = this.state.navClicked;

		const appName = "Cinemap";

		const nextQuote = this.getMessage();




		return(
			//main page
			<div id="AppPage" className="App" >
				<div className="container-fluid">

				<br />

				{/*Show user account page*/}
				{navClicked===-1 &&
				<Start
					onClick={() => this.onNavClick(0)}
					frontPage ={this.state.frontPage}
				/>
				}

				{navClicked!==0 &&
				<div id="GoHome" >

				{/*this is an arrow function because it's a callback
				 - it needs to take in a number to load the next main page*/}
				<button
				type="button" className="btn btn-info"
				onClick={() => this.onNavClick(0)}>Home</button>
				<br />
				</div>
				}


				{navClicked===0 &&

				/*the arrow function is needed to pass
					in the number parameter*/
				<div id="Home" >

				{/*display app title header*/}
				<br />
				<h1>{appName}<span role="img" aria-label="clapperboard">&#127916;</span></h1>
				<br />

					<Nav
						onNavClick={ (num) => this.onNavClick(num)}
					/>
					<br />

					<blockquote id="BadQuote" className="blockquote">
						{nextQuote}
					</blockquote>
				</div>
				}

				{/*conditionally display element
					based on the nav link clicked
					using &&
					*/}
				{navClicked===1 &&
				<MovieSearch
					onNavClick={ (num) => this.onNavClick(num)}

					movieList={this.state.movieListArray}
					movieInfo={this.state.movieInfo}

					searchedItem={this.state.searchedItem}
					movieSearch={this.state.movieSearch}

					handleTextSearch={ (text) => this.handleTextSearch(text)}

					onSearchClick={this.onSearchClick}
					onDetailClick={ (id) => this.onDetailClick(id)}
					onDetailBackClick={this.onDetailBackClick}

					isFetched={this.state.isFetched}
					detFetched={this.state.detFetched}

					onNextPageClick={this.onNextPageClick}
					onPrevPageClick={this.onPrevPageClick}
					onMovieBackClick={this.onMovieBackClick}
					currentPage={this.state.currentPage}

					showDetails={this.state.showDetails}
					showMovieSearchButtons={this.state.showMovieSearchButtons}

					maxPagesMovieSearch={this.state.maxPagesMovieSearch}

					searchValid={this.state.searchValid}
					/>
				}

				{/*Actor search - search for a specific actor*/}
				{navClicked===2 &&

				<div id="ActorSearch" >

					<ActorSearch
						actorInfoArray={this.state.actorInfoArray}
						actFetched={this.state.actFetched}

						actorDetails={this.state.actorDetails}
						actDetFetched={this.state.actDetFetched}

						handleActorSearch={this.handleActorSearch}
						onActorSearchClick={this.onActorSearchClick}

						onActorDetailClick={ (id) => this.onActorDetailClick(id)}
						onActorDetailBackClick={this.onActorDetailBackClick}

						showActDetails={this.state.showActDetails}

						currentActorPage={this.state.currentActorPage}
						actSearchMaxPages={this.state.actSearchMaxPages}

						onActorNextClick={this.onActorNextClick}
						onActorPrevClick={this.onActorPrevClick}

						onShowCultClick={this.onShowCultClick}
						onShowCultBackClick={this.onShowCultBackClick}
						showCultHeroes={this.state.showCultHeroes}
						onActorBackClick={this.onActorBackClick}

						searchValid={this.state.searchValid}
					/>

				</div>

				}


				{/*Movie Trivia Quiz*/}
				{navClicked===3 &&
				<div id="Quiz" >

					<Quiz />

				</div>
				}

				{/*Discover popular movies*/}
				{navClicked===4 &&
					<div id="Discovery" >
					{/* TODO - FIX onclick pass to props not working*/}
				<Discover
					discoveredMovies={this.state.discoveredMovies}
					discoveredFetched={this.state.discoveredFetched}
					onDiscoverClick={this.onDiscoverClick}
				/>

				</div>
				}

				{/*Login and register - just a dummy page for now*/}
				{navClicked===5 &&
					<div id="Account" >
						<Login onNavClick={ (num) => this.onNavClick(num)} />

				</div>
				}



				</div>

			</div>
		);
	}


}

export default App;
