import React, {Component} from 'react';


export class Validation extends Component {

  render() {

    const formErrorsLocal = this.props.formErrors;


    return(
      <div id="Validate">
        <div>
          <strong>{formErrorsLocal.userName}</strong>
        </div>

        <div>
          <strong>{formErrorsLocal.password}</strong>
        </div>


        <div>
          <strong>{formErrorsLocal.password2}</strong>
        </div>

        <div>
          <strong>{formErrorsLocal.email}</strong>
        </div>


        <div>
          <strong>{formErrorsLocal.email2}</strong>
        </div>

      </div>
    );

  }

}
