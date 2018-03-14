import React, { Component } from 'react';
import WebStorage from '../../webstorage';
import Config from 'react-global-configuration';
import { fetchWithHeaders } from '../../helper';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginError: '',
    };
  }

  /**
   * @desc Handles login form submission
   *
   */
   loginSubmitHandle = (e) => {
     e && e.preventDefault();

     var form = e.nativeEvent.target,
         email = form.email.value,
         password = form.password.value;

     this.submitLoginForm(email, password);
   }

   /**
    * @desc Submits login form to the API server
    * @param `email` Email of the user
    * @param `password` Password of the user
    *
    */
   submitLoginForm = (email, password) => {
     var formData = JSON.stringify({
       'username': email,
       'password': password
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
         var form = document.body.querySelector('form');
         form.password.value = '';
         this.setState({
           loginError: 'Invalid Email/Password.'
         });
       }
     });
   }

  render() {
    return(
      <div>
        <form onSubmit={this.loginSubmitHandle}>
          <input type="email" name="email" required="true" />
          <input type="password" name="password" required="true" />
          <button type="submit">Login</button>
          { this.state.loginError }
        </form>
      </div>
    );
  }
}

export default Login;
