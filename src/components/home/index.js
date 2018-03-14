import React, { Component } from 'react';

class Home extends Component {
  render() {
    const contentStyle = {
      fontSize: '20px',
      textAlign: 'center',
      marginTop: '200px'
    };

    return (
      <div>
        <div style={contentStyle}>
          Welcome to Student Management Application!
        </div>
      </div>
    );
  }
}

export default Home;
