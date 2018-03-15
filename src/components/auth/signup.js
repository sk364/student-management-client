import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Button, FormGroup, FormControl, ControlLabel, PageHeader } from "react-bootstrap";
import { fetchWithHeaders } from '../../helper';
import './login.css';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
      signUpError: ''
    };
  }

  /**
   * @desc Submits login form to the API server
   * @param `email` Email of the user
   * @param `password` Password of the user
   *
   */
  submitSignUpForm = (event) => {
    event.preventDefault();

    var formData = JSON.stringify({
      'username': this.state.username,
      'password': this.state.password,
      'confirm_password': this.state.confirmPassword
    });

    fetchWithHeaders('/signup/', 'POST', null, formData).then((response) => {
      if (response.success) {
        alert(response.message);
        this.props.history.push(response.redirect_url);
      } else {
        this.setState({
          password: '',
          confirmPassword: '',
          signUpError: response.message
        });
      }
    });
  }

  /**
   * @desc Handles input change
   *
   */
  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  /**
   * @desc Validates form
   *
   */
  validateForm = () => {
    return this.state.username.length > 0 && this.state.password.length >= 8 && this.state.confirmPassword.length >= 8;
  }

  render = () => {
    return(
      <div className="Login">
        <center><PageHeader>Sign Up</PageHeader></center>
        <form onSubmit={this.submitSignUpForm}>
          <FormGroup controlId="username" bsSize="large">
            <ControlLabel>Username</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.username}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <FormGroup controlId="confirmPassword" bsSize="large">
            <ControlLabel>Confirm Password</ControlLabel>
            <FormControl
              value={this.state.confirmPassword}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            bsSize="sm"
            bsStyle="primary"
            disabled={!this.validateForm()}
            type="submit"
          >
            Sign Up
          </Button>

          <Link to="/login" className="btn btn-sm btn-default pull-right">Login</Link>
        </form>

        <div className="login-error">{ this.state.signUpError }</div>
      </div>
    );
  }
}

export default SignUp;