import React, { Component } from 'react';

class Error404 extends Component {
  render() {
    const contentStyle = {
      fontSize: '20px',
      textAlign: 'center',
      marginTop: '200px'
    };

    return(
      <div style={contentStyle}>
        Sorry, the page you are looking for doesnt exist.
      </div>
    );
  }
}

export default Error404;