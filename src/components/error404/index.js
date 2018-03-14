import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Error404 extends Component {
  render() {
    return(
      <div>
        Sorry, the page you are looking for doesnt exist.
        Go back to <Link to='/'>Home</Link>
      </div>
    );
  }
}

export default Error404;