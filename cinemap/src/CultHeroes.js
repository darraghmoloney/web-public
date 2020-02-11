/*
	Displays our curated lists of Cult Actors.
	Note - correct display requires the extra
	react-bootstrap library to be installed
	with
		npm install --save react-bootstrap
*/

import React, { Component } from 'react';
// import Dropdown from 'react-bootstrap/Dropdown';
// import DropdownButton from 'react-bootstrap/DropdownButton';
import {CultActionHeroes, CultActors, TopIndieStars} from './CultStars';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export class CultHeroes extends Component {

	constructor(props) {

		super(props);

		this.state={
			actorLabel: "",
			showActionStar: false,	//used to display extra info from
			showCultStar: false,		// the dropdown menus
			showIndieStar: false,

			showExtraDetails: false,
		}

		this.handleActionStarChoice = this.handleActionStarChoice.bind(this);
		this.handleCultStarChoice = this.handleCultStarChoice.bind(this);
		this.handleIndieStarChoice = this.handleIndieStarChoice.bind(this);


		this.displayActorInfo = this.displayActorInfo.bind(this);
	}

	//use state variables to display current choice in
	//the 3 dropdown menus
	handleActionStarChoice(event) {
		console.log("Action Star clicked for " + event.target.value)
		this.setState({actorLabel: event.target.value,
			//showActionStar: true, showCultStar: false, showIndieStar: false});
			showActionStar: true});
	}

	handleCultStarChoice(event) {
		console.log("Cult Star clicked for " + event.target.value)
		this.setState({actorLabel: event.target.value,
			//showActionStar: false, showCultStar: true, showIndieStar: false});
			showCultStar: true});
	}

	handleIndieStarChoice(event) {
		console.log("Cult Star clicked for " + event.target.value)
		this.setState({actorLabel: event.target.value,
			//showActionStar: false, showCultStar: false, showIndieStar: true});
			showIndieStar: true});
	}

	//this extra detail click is not working properly.
	//intended to call API fetch for actor details
	//and directly jump to that page
	handleExtraClick(id) {
		const onActorDetailClick = this.props.onActorDetailClick;
		this.setState({showExtraDetails: true});
		onActorDetailClick(id);
	}

	//Re-use this code easily - display the actor
	displayActorInfo(actorArray, label) {
		let loc = label - 1;	//labels start at 1, array starts at 0
	//	const onActorDetailClick = this.props.onActorDetailClick;

		return (
			<div className="card">

				<img className="card-image-top" alt={actorArray[loc].name} src={actorArray[loc].image} style={{maxwidth: "300px", maxHeight: "300px"}}/>

						<div className="card-body">
							<h3>{actorArray[loc].name}</h3>
							<p className="card-text">
							{actorArray[loc].why}
							</p>
						</div>




{/*
				<button type="button" className="btn btn-primary"
					//onClick={() => onActorDetailClick(actorArray[loc].id)}
					onClick={this.handleExtraClick}

				>More Info</button>
*/}
			</div>
		);
	}

	//this is intended to show actor details
	//directly, as going to the actor details page
	//had a problem with the conditional rendering
	displayActorDetails() {
		const actorDetails = this.props.actorDetails;

		return (
			<div id="ActorDetails">
				<h2>{actorDetails.name}</h2>

				<table id="ActorDetailsResults" className="table table-sm">
					<tbody>
						<tr>
							<td rowSpan="4">

							{/*only display images if they were returned with api call*/}
							{ actorDetails.images.profiles.length > 0 ?
								(
									<img
										src={'https://image.tmdb.org/t/p/w185/'+actorDetails.images.profiles[0].file_path}
										alt={"Picture of"+actorDetails.name}
										style={{maxHeight: "250px"}}
									>
									</img>
								)
								: "No image :("
							}
							</td>
						</tr>
						<tr>
							{/*convert ISO datestring in an overly convoluted manner*/}
							<td>Date of Birth:&nbsp;{actorDetails.birthday !== null ? (actorDetails.birthday.split('-').reverse().join('/')) : "Unknown"  }</td>
						</tr>
							<tr>
							{/*conditionally show the age or the
							date of death, depending on how
							fresh the actor is.
							will not work correctly for vampire
							or zombie actors.*/}
							{actorDetails.deathday===null &&
								<td>Age: {this.getAge(actorDetails.birthday)} </td>
							}
							{actorDetails.deathday !== null &&
								<td>Died: {actorDetails.deathday.split('-').reverse().join('/')}</td>
							}
							</tr>
						<tr>
							<td colSpan="2">Born in {actorDetails.place_of_birth}</td>
						</tr>
					</tbody>
				</table>

				<p>{actorDetails.biography}</p>

				<button className="btn btn-info"

				>
					Back
				</button>
			</div>
		);
	}

	render ()
	{

	//const onShowCultClick = this.props.onShowCultClick;
	const handleActionStarChoice = this.handleActionStarChoice;
	const handleCultStarChoice = this.handleCultStarChoice;
	const handleIndieStarChoice = this.handleIndieStarChoice;
	const displayActorInfo = this.displayActorInfo;


	//let actDetFetched = this.props.actDetFetched;

	let showActionStar = this.state.showActionStar;
	let showCultStar = this.state.showCultStar;
	let showIndieStar = this.state.showIndieStar;

	return(
	<div id="Cult Heroes">
	<div className = "container-fluid">


			<div>


			<h1>Cult Heroes</h1>


			<Accordion>
			  <Card>
			    <Card.Header>
			      <Accordion.Toggle as={Button} variant="link" eventKey="0">
			        Cult Action Heroes
			      </Accordion.Toggle>
			    </Card.Header>
			    <Accordion.Collapse eventKey="0">
			      <Card.Body>
							<select
								className="form-control"
								style={{width: "75%", margin: "auto"}}
								onClick={handleActionStarChoice}
							>
								{
									CultActionHeroes.map(actor =>
										<option key={actor.label} value={actor.label}

										>
											{actor.name}
										</option>

									)
								}
								</select>
								{showActionStar===true &&
									<div>
										<br />
										{displayActorInfo(CultActionHeroes, this.state.actorLabel)}
									</div>

								}


							</Card.Body>
			    </Accordion.Collapse>
			  </Card>
			  <Card>
			    <Card.Header>
			      <Accordion.Toggle as={Button} variant="link" eventKey="1">
			        Cult Actors
			      </Accordion.Toggle>
			    </Card.Header>
			    <Accordion.Collapse eventKey="1">
			      <Card.Body>
							<select
								className="form-control"
								style={{width: "75%", margin: "auto"}}
								onClick={handleCultStarChoice}
							>
								{
									CultActors.map(actor =>
										<option key={actor.label} value={actor.label}>
											{actor.name}
										</option>

									)
								}
								</select>
								{showCultStar===true &&
									<div>
										<br />
										{displayActorInfo(CultActors, this.state.actorLabel)}
									</div>

								}
						</Card.Body>
			    </Accordion.Collapse>
			  </Card>
				<Card>
			    <Card.Header>
			      <Accordion.Toggle as={Button} variant="link" eventKey="2">
			        Top Indie Stars
			      </Accordion.Toggle>
			    </Card.Header>
			    <Accordion.Collapse eventKey="2">
			      <Card.Body>
							<select
								className="form-control"
								style={{width: "75%", margin: "auto"}}
								onClick={handleIndieStarChoice}
							>
								{
									TopIndieStars.map(actor =>
										<option key={actor.label} value={actor.label}>
											{actor.name}
										</option>

									)
								}
								</select>
								{showIndieStar===true &&
									<div>
										<br />
										{displayActorInfo(TopIndieStars, this.state.actorLabel)}
									</div>

								}
						</Card.Body>
			    </Accordion.Collapse>
			  </Card>
			</Accordion>

			</div>

	</div>

</div>
);
}
}
