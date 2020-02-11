import React, {Component} from 'react';

//this class provides the menu
//that links to different elements
//navigation is done by changing the state
//variable that refers to the current page.
//then boolean checks load the relevant section
//on the main App page.
export class Nav extends Component {

	render() {

		const onNavClick = this.props.onNavClick;

		return(

			<div id="NavBar">
				<br />
				<button
					type="button" className="btn btn-secondary"
					onClick={() => onNavClick(1)}>
						Movie Search
				</button>
				<br /><br />
				<button
					type="button" className="btn btn-secondary"
					onClick={() => onNavClick(2)}>
						Actor Search
				</button>

				<br /><br />
				<button
					type="button" className="btn btn-secondary"
					onClick={() => onNavClick(3)}>
						Movie Quiz
				</button>
				<br /><br />
				<button
					type="button" className="btn btn-secondary"
					onClick={() => onNavClick(4)}>
						Discover
				</button>
				<br /><br />
				<button
					type="button" className="btn btn-primary"
					onClick={() => onNavClick(5)}>
						My Account
				</button>
			</div>
		);

	}

}
