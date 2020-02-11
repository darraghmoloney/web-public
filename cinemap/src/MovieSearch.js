/*
	The Movie Search component gives a movie search box,
	gets info about a specific movie, and gives lists
	of cult movies.
*/

import React, {Component} from 'react';
import {SoBadItsGood} from './SoBadItsGood';
import {worstMovies} from './worstMovies';
import towel from './images/towel.jpg';

export class MovieSearch extends Component {

	constructor(props) {

		super(props);

		this.state = {
			showSoBad: false, 		//these are both cult movie lists
			showTerrible: false,

			soBadChoice: null,
			terribleChoice: null,

		}

		this.handleSoBadClick = this.handleSoBadClick.bind(this);
		this.handleSoBadDetailClick = this.handleSoBadDetailClick.bind(this);
		this.handleTerribleClick = this.handleTerribleClick.bind(this);
		this.handleTerribleDetailClick = this.handleTerribleDetailClick.bind(this);
	}


	/*calculate the difference between critic
		and audience reviews for our "good bad" movie
		rating metric.
		it gives an arbitray percent based on "The Room"'s ratings
		- a classic cult film which is objectively terrible
		but loved for its abject but sincere terribleness.
		so some other movies might be over 100%*/
	getGoodBadRating(imdbRating, metascore) {

		let rating = Math.trunc((
				((imdbRating*10)-metascore) * 100 ) / 28);

		//this is necessary because we don't
		//want NaN actually printing to the screen
		if( isNaN(rating) === true) {
			rating = null;
		}

		return rating;

		/*
		return Math.trunc((
				((imdbRating*10)-metascore) * 100 ) / 28);
				*/
	}

	//display an (in?)appropriate comment after the good bad rating
	getGBRcomment(gbrScore) {
		if(gbrScore !== 0 && gbrScore !== null  ) {
			if(gbrScore > 0) {
				return <em>% (Underrated)</em>;
			} else {
				return <em>% (Overrated)</em>;
			}
		}
		if( gbrScore === null ) {
			return <em>(Irrelevant)</em>
		}
		return <em> (Perfectly rated. Weird.)</em>;

	}

	//toggle showing so bad it's good movie info
	handleSoBadClick() {
		console.log("So Bad They're Good movies button clicked");
		this.setState({showSoBad: !this.state.showSoBad});
	}

	//show more details about so bad good movies
	handleSoBadDetailClick(event) {
		console.log("So Bad movie detail button clicked");
		this.setState({soBadChoice: event.target.value});
	}

	//toggle showing terrible movies info
	handleTerribleClick() {
		console.log("Terrible movies button clicked");
		this.setState({showTerrible: !this.state.showTerrible});
	}

	//show more details about terrible movies
	handleTerribleDetailClick(event) {
		console.log("Terrible movies detail button clicked");
		this.setState({terribleChoice: event.target.value});
	}

	render() {

		const movieList = this.props.movieList;	//general search
		const movieInfo = this.props.movieInfo; //detailed info for 1 movie


		const handleTextSearch = this.props.handleTextSearch;	//input searches
		const onSearchClick = this.props.onSearchClick;

		const onNextPageClick = this.props.onNextPageClick;	//navigation
		const onPrevPageClick = this.props.onPrevPageClick;

		const handleSoBadClick = this.handleSoBadClick;
		const handleSoBadDetailClick = this.handleSoBadDetailClick;
		const handleTerribleClick = this.handleTerribleClick;
		const handleTerribleDetailClick = this.handleTerribleDetailClick;

		let onDetailClick = this.props.onDetailClick;		//show details toggle

		const onDetailBackClick = this.props.onDetailBackClick; //for "back" button
		const onMovieBackClick = this.props.onMovieBackClick;		//functionality

		let isFetched = this.props.isFetched;
		let detFetched = this.props.detFetched;		//movie details fetched?

		let page = this.props.currentPage;
		let showDetails = this.props.showDetails; //show details toggle
		let showSoBad = this.state.showSoBad;
		let showTerrible = this.state.showTerrible;
		let showMovieSearchButtons = this.props.showMovieSearchButtons;
	//	let maxPagesMovieSearch = this.props.maxPagesMovieSearch;

		let searchValid = this.props.searchValid;

		return(

			<div id="MovieSearchPage">

			{/*Routes would be so much better...*/}
			{ showDetails === false && showMovieSearchButtons === true &&
				showSoBad === false && showTerrible === false &&

				<div id="MovieButtons">
					<div id="MovieSearchBar">
					<br />

							<div className="form form-group">

								<input
									className="form"
									type="text"
									placeholder="Type a movie title"
									id="MovieSearchForm"
									onChange={handleTextSearch}
								>
								</input>

								<br />

								<button
									className="btn btn-primary"
									type="submit"
									id="MovieSearchButton"
									onClick={onSearchClick}
									disabled={!searchValid}
								>
									{/*uses a magnifying glass emoji, so adding description
									for accessibility & to stop React's nagging warnings*/}
									<span role="img" aria-label="search icon">&#x1f50e;</span>
									Search
								</button>
							</div>

						</div>

						<div id="SoBadItsGoodBtn">
							<br />
							<button
								className="btn btn-secondary"
								onClick={handleSoBadClick}
							>
							So Bad It's Good Movies
							</button>

						</div>

{
	/* SHOW LATER IF USED

						<div id="AverageGoodMoviesBtn">
							<br />
							<button className="btn btn-secondary">Average Good Movies</button>
						</div>

						<div id="CultClassicsBtn">
							<br />
							<button className="btn btn-secondary">Cult Classics</button>
						</div>

						<div id="AverageCrapMoviesBtn">
							<br />
							<button className="btn btn-secondary">Average Crap Movies</button>
						</div>
	*/
}
						{/*for showing genuinely terrible movies*/}
						<div id="CrapMoviesBtn">
							<br />
							<button
								className="btn btn-secondary"
								onClick={handleTerribleClick}
							>Absolutely Crap Movies</button>
						</div>

					</div>
		}


				{/*generate table after successfull fetch
					this is the basic movie titles table*/}
				{isFetched && movieList.Response !== "False" && showDetails ===false &&
					showMovieSearchButtons === false &&
					<div id="MovieSearchResults">
						<br />
						<table className="table table-hover table-sm">
								<thead>
									<tr>
										<th>Name</th>
										<th>Year</th>
									</tr>
								</thead>
							<tbody>
								{/*map is the hardest working function*/}
								{movieList.Search.map((movie, index) => (

									<tr key = {index}>
											<td><button className="btn btn-link"
												onClick={() => onDetailClick(movie.imdbID)}
											>
												<strong style={{color: "#f5dea3"}}>{movie.Title}</strong>
											</button>
											</td>
											<td>{movie.Year}</td>
											{/*imdb link is a bit ugly and App doesn't handle going back well*/}
											<td><a href={"https://m.imdb.com/title/"+movie.imdbID}>IMDb</a></td>

										</tr>

										)

									)}


							</tbody>
						</table>

							{/*this NEXT button should not show on the last page
								but this hasn't been fully implemeneted.
								but at least, it won't work on the last page*/}
							<div id="NextButton">
								<button
									type="button" className="btn btn-secondary"
									onClick={onNextPageClick}
								>Next &#8250;</button>
							</div>

							Page {page}
						{/*only show the previous button
							if there is a page before it*/}
						{	page > 1 &&
						<div id="PreviousButton">

							<button
								type="button" className="btn btn-secondary"
								onClick={onPrevPageClick}
							>&#8249; Previous</button>
						</div>
						}


						{/* back button changes the boolean value for displaying
							this section conditionally.
							this is a pretty stupid way to do it, but the app was
							built this way and it would take a lot of work
							to refactor it now. */}
						<div id="BackToMovieBtns">
							<br />
							<button
								type="button" className="btn btn-info"
								onClick={onMovieBackClick}
							>Back
							</button>
						</div>
					</div>
				}

			{/*here, we show extra details about the specific
				movie that was clicked on*/}
			{ detFetched === true && showDetails === true &&

				<div id="MovieInDetail">
				{/*More? You want MORE?!*/}

					<h2 style={{color: "#f5dea3"}}>{movieInfo.Title}</h2>
					<div id="MoviePoster">
					{/*need the maxHeight for mobile niceness, even though it's less
					responsive*/}
						<img style={{maxHeight: "200px"}} className="img-fluid" src={movieInfo.Poster} alt="Movie poster" />
					</div>

					<div id="Plot">
						<p>{movieInfo.Plot}</p>
					</div>

					<div id="MoreMovieDetails" className="table-sm" >
						<details>
							<summary style={{backgroundColor: "#f5dea3", color: "black"}}>More Info</summary>
							<table className="table table-striped table-bordered table-hover">
								<tbody>

									<tr>

										<td colSpan="2">Genre:	<b>{movieInfo.Genre}</b></td>
									</tr>
									<tr>
										<td>{movieInfo.Year}, {movieInfo.Rated}</td>
										<td>{movieInfo.Runtime}</td>
									</tr>
									<tr>
										<td colSpan="2">Stars <strong>{movieInfo.Actors}</strong></td>
									</tr>
									<tr>
										<td>Critics: {movieInfo.Metascore}%</td>
										{/*IMDb scores are out of 10, not 100,
											so we multiply them by 10 to compare it with
											the metacritic percent*/}
										<td>Public: {movieInfo.imdbRating*10}%</td>
									</tr>

								</tbody>
							</table>
						</details>
					</div>

							{/*
								<br />
								*/}


							<div id="GoodBadRatingReport" className="alert alert-info">
								<details>
									<summary>
										<b>GoodBad™</b> Rating:&nbsp;
										{this.getGoodBadRating(movieInfo.imdbRating, movieInfo.Metascore)}

										{/*return an underrated or overrated comment depending on
											the goodbad rating returned(critic vs audience reviews)*/}
										{this.getGBRcomment(this.getGoodBadRating(movieInfo.imdbRating, movieInfo.Metascore))}

									</summary>
									<br />
									<p><small>The GoodBad™©® Rating is a special metric that
									compares audience and critic ratings for movies.</small></p>
									<p><small>A movie that is highly rated by the public but
									not by critics will have a high positive score.</small></p>
									<p><small>A movie that critics really like but audiences
									didn't will have a high negative score.</small></p>
								</details>
							</div>
							<br />


							<button
								onClick={onDetailBackClick}
								type="button" className="btn btn-secondary"
							>
							Back
							</button>

								<br />

				</div>
			}

			{/*handle successful fetch, but no valid results*/}
			{ movieList.Response === "False" &&
				movieList.Error === "Movie not found!" && showMovieSearchButtons === false &&
				<div id="MovieFetchNoResults">
					<p><em>...Nothing to see here, move along...</em></p>
					<button
						type="button" className="btn btn-info"
						onClick={onMovieBackClick}
					>Back
					</button>
				</div>
			}

			{/*handle successful fetch, but too many results to display*/}
			{ movieList.Response === "False" &&
				movieList.Error === "Too many results." && showMovieSearchButtons === false &&
				<div id="MovieFetchNoResults">
					<p><em>...You'll have to be more specific...</em></p>
					<button
						type="button" className="btn btn-info"
						onClick={onMovieBackClick}
					>Back
					</button>
				</div>
			}

			{/*handle a search click, with no text input*/}
			{ movieList.Response === "False" &&
				movieList.Error === "Something went wrong." && showMovieSearchButtons === false &&
				<div id="MovieFetchErr" >
					<p><em>...You'll have to speak up, I'm wearing a towel</em></p>
					<img src={towel} alt="Homer Simpson in a towel" style={{maxwidth: "300px"}} />
					<br />
					<br />
					<button
						type="button" className="btn btn-info"
						onClick={onMovieBackClick}
					>Back
					</button>
				</div>

			}

			{/*display curated list of so bad they're good movies*/}
			{ showSoBad === true &&
				<div id="ShowSoBadItsGood">

				<br />
					<div id="SoBadDropdown" className="form-group">
						<h1>So Bad It's Good <span role="img" aria-label="thumbs up">&#128077;</span></h1>
						<select
							className="form-control"
							style={{width: "75%", margin: "auto"}}
							onClick={handleSoBadDetailClick}
						>

							{/*make a drop down menu of the so bad it's good movies*/}
							{
								SoBadItsGood.map(movie =>
									<option key={movie.id} value={movie.id}>
										{movie.title}
									</option>

								)
							}
						</select>
						<br />

						{/*show the details on so bad movie dropdown choice*/}
						{ this.state.soBadChoice !== null &&
							<div id="SoBadDetails">

								<div className="card">

									<img className="card-img-top" src={SoBadItsGood[this.state.soBadChoice].image} alt="So Bad It's Good Movie" />
									<div className="card-body">
										<h5 className="card-title">{SoBadItsGood[this.state.soBadChoice].title}</h5>
										<h6 className="card-subtitle mb-2 text-muted">
											{SoBadItsGood[this.state.soBadChoice].genre}&nbsp;&nbsp;|&nbsp;&nbsp;
											{SoBadItsGood[this.state.soBadChoice].year}
										</h6>
										<br />
										<h6 className="card-subtitle mb-2 text-muted">
											Directed by <strong>{SoBadItsGood[this.state.soBadChoice].director}</strong>
										</h6>
										<h6 className="card-subtitle mb-2 text-muted">
										Stars <strong>{SoBadItsGood[this.state.soBadChoice].starring}</strong>
										</h6>
										<br />
										<h6>What's it about?</h6>
										<p className="card-text">{SoBadItsGood[this.state.soBadChoice].plot}</p>
										<div id="ExpertOpinionSoBad" style={{backgroundColor: "lightgrey"}}>
											<br />
											<h5>Our EXPERT Opinion</h5>
											<br />
											<h6>Why it's good:</h6>
											{/*these "why" comments are personally contributed by the App team*/}
											<p className="card-text">{SoBadItsGood[this.state.soBadChoice].why}</p>
											<br />
										</div>
										<h6>Critical Reception:</h6>
										<p>Public: {SoBadItsGood[this.state.soBadChoice].imdbscore * 10} Critics: {SoBadItsGood[this.state.soBadChoice].metacriticscore}</p>
										<details>
												<summary>
													<b>GoodBad™</b> Rating:&nbsp;
													{this.getGoodBadRating(SoBadItsGood[this.state.soBadChoice].imdbscore, SoBadItsGood[this.state.soBadChoice].metacriticscore)}

													{/*return an underrated or overrated comment depending on
														the goodbad rating returned(critic vs audience reviews)*/}
													{this.getGBRcomment(this.getGoodBadRating(SoBadItsGood[this.state.soBadChoice].imdbscore, SoBadItsGood[this.state.soBadChoice].metacriticscore))}

												</summary>
												<br />
												<p><small>The GoodBad™©® Rating is a special metric that
												compares audience and critic ratings for movies.</small></p>
												<p><small>A movie that is highly rated by the public but
												not by critics will have a high positive score.</small></p>
												<p><small>A movie that critics really like but audiences
												didn't will have a high negative score.</small></p>
										</details>
										<br />
										<button
											className="btn btn-primary"
											onClick={() => {onDetailClick(SoBadItsGood[this.state.soBadChoice].imdbID); handleSoBadClick()}}
										>
											More Info
										</button>
									</div>
								</div>


							</div>
						}



					</div>

					{/*go back to previous page*/}
					<div id="SoBadToggle">

						<button
							className="btn btn-info"
							onClick={handleSoBadClick}
						>
							Back
						</button>
					</div>
				</div>
			}

			{/*almost the same code as so bad it's good - refactor to function? */}
			{ showTerrible === true &&
				<div id="ShowTerrible">


								<br />

									<div id="TerribleDropdown" className="form-group">
											<h1>Hell's Cinema <span role="img" aria-label="fire">&#128293;</span></h1>
											<select
												className="form-control"
												style={{width: "75%", margin: "auto"}}
												onClick={handleTerribleDetailClick}
											>
												{/*make a drop down menu of the worst movies*/}
												{
													worstMovies.map(movie =>
														<option key={movie.id} value={movie.id}>
															{movie.title}
														</option>

													)
												}
											</select>
											<br />
										</div>

										{ this.state.terribleChoice !== null &&
											<div id="TerribleDetails">

												<div className="card">

													<img className="card-img-top" src={worstMovies[this.state.terribleChoice].image} alt="Terrible Movie" />
													<div className="card-body">
														<h5 className="card-title">{worstMovies[this.state.terribleChoice].title}</h5>
														<h6 className="card-subtitle mb-2 text-muted">
															{worstMovies[this.state.terribleChoice].genre}&nbsp;&nbsp;|&nbsp;&nbsp;
															{worstMovies[this.state.terribleChoice].year}
														</h6>
														<br />
														<h6 className="card-subtitle mb-2 text-muted">
															Directed by <strong>{worstMovies[this.state.terribleChoice].director}</strong>
														</h6>
														<h6 className="card-subtitle mb-2 text-muted">
														Stars <strong>{worstMovies[this.state.terribleChoice].starring}</strong>
														</h6>
														<br />
														<h6>What's it about?</h6>
														<p className="card-text">{worstMovies[this.state.terribleChoice].synopsis}</p>

														<div id="CriticsCriticize" style={{backgroundColor: "lightgrey"}}>
															<br />
															<h6>What the critics said:</h6>
															<br />
															<blockquote className="card-text">
																"{worstMovies[this.state.terribleChoice].comment}"

															</blockquote>
															<br />
															<i>{worstMovies[this.state.terribleChoice].critic}</i>
															<br /><br />
														</div>

														<h6>Critical Reception:</h6>
														<p>Public: {worstMovies[this.state.terribleChoice].imdbscore * 10} Critics: {worstMovies[this.state.terribleChoice].metacriticscore}</p>
														<details>
																<summary>
																	<b>GoodBad™</b> Rating:&nbsp;
																	{this.getGoodBadRating(worstMovies[this.state.terribleChoice].imdbscore, worstMovies[this.state.terribleChoice].metacriticscore)}

																	{/*return an underrated or overrated comment depending on
																		the goodbad rating returned(critic vs audience reviews)*/}
																	{this.getGBRcomment(this.getGoodBadRating(worstMovies[this.state.terribleChoice].imdbscore, worstMovies[this.state.terribleChoice].metacriticscore))}

																</summary>
																<br />
																<p><small>The GoodBad™©® Rating is a special metric that
																compares audience and critic ratings for movies.</small></p>
																<p><small>A movie that is highly rated by the public but
																not by critics will have a high positive score.</small></p>
																<p><small>A movie that critics really like but audiences
																didn't will have a high negative score.</small></p>
														</details>
														<br />
														<button
															className="btn btn-primary"
															onClick={() => {onDetailClick(worstMovies[this.state.terribleChoice].imdbID); handleTerribleClick()}}
														>
															More Info
														</button>
													</div>
												</div>


											</div>
										}





					{/*the toggle itself is actually fine. it just toggles the
						terrible movie list. */}
					<div id="TerribleToggle">
						<button
							className="btn btn-info"
							onClick={handleTerribleClick}
						>
							Back
						</button>
					</div>
				</div>
			}


			<br />

			{/* The movie DB API actually requires that you give them credit */}
			<footer style={{color: "black"}}>
				Search APIs kindly provided by <a href="http://www.omdbapi.com/" style={{color: ""}}>The Open Movie Database</a>
				&nbsp;and <a href="https://www.themoviedb.org/documentation/api">
				The Movie Database API</a>
			</footer>

			</div>
		);

	}

}
