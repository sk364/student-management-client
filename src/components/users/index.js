import React, {Component} from 'react';
import {fetchWithHeaders} from '../../helper';

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  /**
   * @desc Fetch all users
   *
   */
  fetchUsers = () => {
    fetchWithHeaders('/students/').then((response) => {
      this.setState({users: response});
    });
  }

  componentWillMount = () => {
    this.fetchUsers();
  }

  render = () => {
    return(
      <div></div>
    );
  }
}

export default Users;