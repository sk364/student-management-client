import React, { Component } from 'react';
import WebStorage from '../../webstorage';
import Config from 'react-global-configuration';
import { Button, FormGroup, FormControl, ControlLabel, PageHeader } from "react-bootstrap";
import { fetchWithHeaders } from '../../helper';
import './login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loginError: ''
    };
  }

  /**
   * @desc Submits login form to the API server
   * @param `email` Email of the user
   * @param `password` Password of the user
   *
   */
  submitLoginForm = (event) => {
    event.preventDefault();

    var formData = JSON.stringify({
      'username': this.state.username,
      'password': this.state.password
    });

    fetchWithHeaders('/login/', 'POST', null, formData).then((response) => {
      if (response.token) {
        WebStorage.setItem('_jwt', response.token);
        WebStorage.setItem('isUserLoggedIn', true);
        WebStorage.setItem('isAdmin', response.is_admin);
        WebStorage.setItem('userId', response.user_id);
        Config.update('isUserLoggedIn', true);
        Config.update('isAdmin', response.is_admin);
        Config.update('userId', response.user_id);
        this.props.history.push('/');
      } else {
        this.setState({
          password: '',
          loginError: response.non_field_errors
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
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  render = () => {
    return(
      <div className="Login">
        <center><PageHeader>Login</PageHeader></center>
        <form onSubmit={this.submitLoginForm}>
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
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Login
          </Button>
        </form>

        <div className="login-error">{ this.state.loginError }</div>
      </div>
    );
  }
}

export default Login;
