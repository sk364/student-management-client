import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Config from 'react-global-configuration';
import NavHeader from './header';

class App extends Component {
  constructor(props) {
    super(props);

    var landingPageURL = this.props.history.location.pathname;
    var isLoginPage = this.checkIfLoginPageURL(landingPageURL);

    if (!isLoginPage && !Config.get('isUserLoggedIn')) {
      this.props.history.push('/login');
    }

    this.props.history.listen((location, action) => {
      isLoginPage = this.checkIfLoginPageURL(location.pathname);
      if (!isLoginPage && !Config.get('isUserLoggedIn')) {
        this.props.history.push('/login');
      }
    });
  }

  /**
   * @desc Checks if the url is login page url
   * @param `url` Current Page URL
   * @return boolean
   *
   */
  checkIfLoginPageURL(url) {
    return url.indexOf('login') !== -1;
  }

  render() {
    return(
      <div>
        <NavHeader />
        {this.props.children}
      </div>
    );
  }
}

export default withRouter(App);
