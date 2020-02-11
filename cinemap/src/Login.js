/*
  Partially finished login form that just checks
  for valid input, but doesn't store info.
*/

import React, {Component} from 'react';
import {Validation} from './Validation';
import {Register} from './Register';

export class Login extends Component {

  constructor(props) {

    super(props);

    this.state = {

      userName: "",
      password: "",
      formErrors: {'userName': "", 'password': ""},
      userNameValid: false,
      passwordValid: false,
      formValid: false,


      registerClicked: false,
    }

    this.handleInputUserName=this.handleInputUserName.bind(this);
    this.handleInputPassword=this.handleInputPassword.bind(this);
    this.validateForm=this.validateForm.bind(this);
    this.validateUserName=this.validateUserName.bind(this);
    this.validatePassword=this.validatePassword.bind(this);

    this.onRegisterClick=this.onRegisterClick.bind(this);
    this.onBackClick=this.onBackClick.bind(this);

  }

  onRegisterClick() {
    this.setState({registerClicked: true});
    console.log("Register button clicked")
  }

  onBackClick() {
    this.setState({loginClicked: false, registerClicked: false});
  }


  handleInputUserName(event) {
    this.setState({userName: event.target.value});
    this.validateUserName(event.target.value);
  }

  handleInputPassword(event) {
    this.setState({password: event.target.value});
    this.validatePassword(event.target.value);
  }

  validateForm() {
    this.setState({formValid: this.state.userNameValid && this.state.passwordValid});
  }

  validateUserName(userName) {
    let localFormErrors = this.state.formErrors;

    if(userName.length < 4) {
      localFormErrors.userName = "User name must be at least 4 characters.";
      this.setState({userNameValid: false});
    } else if( !(/^[\w]+$/.test(userName))  ) {
      //username should only contain nums or digits
      localFormErrors.userName = "User name may only contain numbers or digits.";
      this.setState({userNameValid: false});
    } else {
      localFormErrors.userName = "";
      this.setState({userNameValid: true});
    }

    this.setState({formErrors: localFormErrors}, this.validateForm());

    ;
  }

  validatePassword(password) {
    let localFormErrors = this.state.formErrors;

    if(password.length < 6) {
      localFormErrors.password = "Password must be at least 6 characters.";
      this.setState({passwordValid: false});
    } else if( !(/[0-9]/.test(password))  ) {
      //username should only contain nums or digits
      localFormErrors.password = "Password must contain numbers.";
      this.setState({passwordValid: false});
    } else {
      localFormErrors.password = "";
      this.setState({passwordValid: true});
    }

    this.setState({formErrors: localFormErrors}, this.validateForm());


  }


  render() {

    const onNavClick = this.props.onNavClick;


    return(
      <div id="Login">

            {this.state.registerClicked===false &&

              <div className="LoginForms">
                <br />
                <input
                  id="LoginUsernameForm"

                  type="text"
                  placeholder="Enter User Name"
                  name="getUserName"
                  onChange={this.handleInputUserName}
                  required
                >
                </input>
                <input
                  id="LoginPasswordForm"

                  type="password"
                  placeholder="Enter Password"
                  name="getPassword"
                  onChange={this.handleInputPassword}
                  required
                  >
                </input>

                <button
                  id="SubmitLoginDetails"
                  onClick={() => onNavClick(0)}
                  disabled={!this.state.formValid}
                  type="button" className="btn btn-primary"
                >
                Continue
                </button>
              </div>
            }

                {this.state.registerClicked===true &&
                  <div>
                  <Register onNavClick={this.props.onNavClick}/>
                  <br />
                  <button
                    onClick={this.onBackClick}
                    className="btn btn-info"
                  >
                    Back
                  </button>
                  </div>
                }


                <Validation formErrors={this.state.formErrors}/>
                {/*
                <br />
                <button id="Submit" >Register</button>
                */}

                <button type="button" className="btn btn-link" onClick={this.onRegisterClick}>Register</button>

      </div>
    );

  }


}
