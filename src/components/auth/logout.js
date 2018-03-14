import React, { Component } from 'react';
import WebStorage from '../../webstorage';
import Config from 'react-global-configuration';

class Logout extends Component {
  componentWillMount = () => {
    WebStorage.clear();
    Config.update('isUserLoggedIn', false);
    Config.update('isAdmin', false);
    this.props.history.push('/login');
  }

  render() {
    return null;
  }
}

export default Logout;
