/*
  The splash screen / launch page for the App.
  If we finished the login/register functionality, it should go here.
*/


import React, {Component} from 'react';
//import {Login} from './Login';
//import {Register} from './Register';

export class Start extends Component {

  constructor(props) {

    super(props);

    this.state = {
      loginClicked: false,
      registerClicked: false,

      showHome: false,

    };

    this.onLoginClick = this.onLoginClick.bind(this);
    this.onRegisterClick = this.onRegisterClick.bind(this);
    this.onBackClick = this.onBackClick.bind(this);
  }

  onLoginClick() {
    this.setState({loginClicked: true});
    console.log("Login button clicked");
  }

  onRegisterClick() {
    this.setState({registerClicked: true});
    console.log("Register button clicked")
  }

  onBackClick() {
    this.setState({loginClicked: false, registerClicked: false});
  }


  render() {


    return(



      <div id="StartPage">

      {this.state.loginClicked===false &&
        this.state.registerClicked===false &&


        <div id="StartElements">
        <br />
        <div
          id="WelcomeImage"
          className="container-fluid"
        >
          <br />

          <h1>Welcome<br /> to the<br /> Cinemap App</h1>
          <br />
          {/*An image might be good.*/}
        </div>

{
  /*
          <div id="loginRegister">
            <br />
            <button type="button" className="btn btn-primary" onClick={this.onLoginClick}>Log In</button>

            <button type="button" className="btn btn-link" onClick={this.onRegisterClick}>Register</button>
          </div>
 */
}
        </div>
      }
{
  /*
        {this.state.loginClicked===true &&
          <div id="showLogin">
          <Login
            showHome ={this.props.showHome}
            onClick={this.props.onClick}
          />
          <br />
          <button
          type="button" className="btn btn-info"
          onClick={this.onBackClick}>Back
          </button>
          </div>
        }
        {this.state.registerClicked===true &&
          <div>
          <Register />
          <br />
          <button
            onClick={this.onBackClick}
            className="btn btn-info"
          >
            Back
          </button>
          </div>
        }
  */
}

      </div>

    );

  }


}
