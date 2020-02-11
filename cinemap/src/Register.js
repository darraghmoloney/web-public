/*
  This component is an example registration page.
  It doesn't actually register the user, but
  shows how it might be done with validation.
  This could be used with Firebase.
*/

import React, {Component} from 'react';
import {Validation} from './Validation';

export class Register extends Component {

  constructor(props) {

    super(props);

    this.state = {

      userName: "",
      password: "",
      //password2: "",  //not sure why we need to store this in state too?

      email: "",
      //email2: "",

      formErrors: {'userName': "", 'password': "", "password2": "", 'email': "", 'email2': ""},
      userNameValid: false,
      passwordValid: false,
      password2Valid: false,
      formValid: false,
      emailValid: false,
      email2Valid: false,

    }

    //Bind everything because??
    this.handleInputUserName=this.handleInputUserName.bind(this);
    this.handleInputPassword=this.handleInputPassword.bind(this);
    this.handleInputEmail=this.handleInputEmail.bind(this);
    this.validateForm=this.validateForm.bind(this);
    this.validateUserName=this.validateUserName.bind(this);
    this.validateEmail=this.validateEmail.bind(this);
    this.validatePassword=this.validatePassword.bind(this);

    this.handleInputPassword2 = this.handleInputPassword2.bind(this);
    this.validatePassword2 = this.validatePassword2.bind(this);

    this.handleInputEmail2 = this.handleInputEmail2.bind(this);
    this.validateEmail2 = this.validateEmail2.bind(this);
  }


    handleInputUserName(event) {
      this.setState({userName: event.target.value});
      this.validateUserName(event.target.value);
    }

    handleInputPassword(event) {
      this.setState({password: event.target.value});
      this.validatePassword(event.target.value);
    }

    handleInputPassword2(event) {
      this.validatePassword2(event.target.value);
    }

    handleInputEmail(event) {
      this.setState({email: event.target.value});
      this.validateEmail(event.target.value);
    }

    handleInputEmail2(event) {
      this.validateEmail2(event.target.value);
    }

    validateForm() {
      this.setState({formValid: this.state.userNameValid && this.state.passwordValid && this.state.emailValid});
    }

    //Check the username.
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
    //Check the password.
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

    //Check if the second password is like the first.
    validatePassword2(password2) {
      const password = this.state.password;
      let localFormErrors = this.state.formErrors;

      if(password2 !== password) {
        localFormErrors.password2 = "Passwords do not match";
        this.setState({password2Valid: false})
      } else {
        localFormErrors.password2 = "";
        this.setState({password2Valid: true})
      }

      this.setState({formErrors: localFormErrors}, this.validateForm() );
    }

    validateEmail(email) {
      let localFormErrors = this.state.formErrors;

      //Not sure I understand this to be honest.
      if(!(/^\w+@\w+\.\w+$/.test(email) )) {
        localFormErrors.email = "Email address is not valid.";
        this.setState({emailValid: false});
      } else {
        localFormErrors.email = "";
        this.setState({emailValid: true});
      }

      this.setState({formErrors: localFormErrors}, this.validateForm() );
    }

    validateEmail2(email2) {
      const email = this.state.email;
      let localFormErrors = this.state.formErrors;

      if(email2 !== email) {
        localFormErrors.email2 = "Emails do not match";
        this.setState({email2Valid: false})
      } else {
        localFormErrors.email2 = "";
        this.setState({email2Valid: true})
      }

      this.setState({formErrors: localFormErrors}, this.validateForm() );
    }

    render() {

      const onNavClick = this.props.onNavClick;

      return(
        <div >

          <br />
          <h5>User Name</h5>
          <input placeholder="Choose A User Name" onChange={this.handleInputUserName}></input>
          <br /><br />
          <h5>Password</h5>
          <input placeholder="Choose A Password" type="password" onChange={this.handleInputPassword}></input>
          <input placeholder="Re-enter Password" type="password" onChange={this.handleInputPassword2}></input>
          <br /><br />
          <h5>Email</h5>
          <input placeholder="Email" type="email"onChange={this.handleInputEmail}></input>
          <input placeholder="Re-enter Email" type="email" onChange={this.handleInputEmail2}></input>
          <br /><br />
          {/*Should we disable this button until it is valid?*/}
          <button
            id="RegisterButton"
            className="btn btn-primary"
            onClick={() => onNavClick(0)}
          >
            Continue
          </button>

          <Validation formErrors={this.state.formErrors}/>

        </div>
      );

    }

}

/*
<div id="RegisterPage">
  <input>User Name</input>
  <input>Password</input>
  <input>Re-enter Password</input>
  <input>Email</input>

  <button>Continue</button>
  <button>Log In</button>
</div>
*/
