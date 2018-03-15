import React, {Component} from 'react';
import Config from 'react-global-configuration';
import {fetchWithHeaders} from '../../helper';
import {Button, Glyphicon, ListGroup, ListGroupItem, Tooltip, OverlayTrigger, Modal} from 'react-bootstrap';
import './index.css';
import Error404 from '../error404';

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      showDeleteWarning: false,
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

  /**
   * @desc Removes user with {userId} from {state.users}
   *
   */
  removeUser = (userId) => {
    var users = this.state.users.filter((user) => { return user.id !== userId });
    this.setState({users: users});
  }

  componentWillMount = () => {
    const isAdmin = Config.get('isAdmin');
    if (isAdmin) {
      if (!this.props.users) {
        this.fetchUsers();
      } else {
        this.setState({users: this.props.users});
      }
    }
  }

  render = () => {
    const userId = Config.get('userId');
    const isAdmin = Config.get('isAdmin');
    var userBlocks = this.state.users.map((user, index) => {
      return (
        <UserBlock
          key={user.id}
          user={user}
          removeUser={this.removeUser}
          removeUserFromCourse={this.props.removeUserFromCourse}
          courseId={this.props.courseId} />
      );
    });

    // Remove authenticated user from list
    userBlocks = userBlocks.filter((user) => { return user.key !== userId; });

    return(
      <div>
        {
          isAdmin ?
          <div>
            <ListGroup>
              { userBlocks }
            </ListGroup>

            { userBlocks.length === 0 && <center><strong>Damn! No one except you.</strong></center> }
          </div> :
          <Error404 />
        }
      </div>
    );
  }
}

class UserBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * @desc Toggle delete warning modal state
   *
   */
  toggleDeleteWarning = () => {
    this.setState({showDeleteWarning: !this.state.showDeleteWarning});
  }

  /**
   * @desc Removes a user with {userId}
   * @param `userId` User ID
   * @param `showWarning` Flag to show warning or not
   *
   */
  removeUser = (userId, showWarning=true) => {
    if (showWarning) {
      this.toggleDeleteWarning();
      return;
    }

    fetchWithHeaders('/students/' + userId, 'DELETE').then((response) => {
      alert('User Removed Successfully!');
      this.props.removeUser(userId);
    });
  }

  render = () => {
    const user = this.props.user;
    const deleteUserTooltip = (
      <Tooltip id="tooltip">
        { "Delete user" + (this.props.removeUserFromCourse ? " from course?" : "?" ) }
      </Tooltip>
    );
    const removeUserFromCourse = this.props.removeUserFromCourse
    const removeUser = removeUserFromCourse || this.removeUser;

    return(
      <ListGroupItem>
        <span>{ user.first_name + ' ' + user.last_name }</span>
        &nbsp;<span className="username">{'@' + user.username}</span>
        <OverlayTrigger placement="bottom" overlay={deleteUserTooltip}>
          <Button
            bsSize="sm"
            className="pull-right"
            bsStyle="danger"
            onClick={
              (event) => {
                if (removeUserFromCourse) {
                  this.props.removeUser(user.id);
                  removeUser(this.props.courseId, user.id);
                } else {
                  removeUser(user.id);
                }
              }
            }>
            <Glyphicon glyph="trash" />
          </Button>
        </OverlayTrigger>
        { this.state.showDeleteWarning &&
          <Modal.Dialog>
            <Modal.Header closeButton>
              Confirm Delete?
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete?
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.toggleDeleteWarning}>No</Button>
              <Button bsStyle="danger" onClick={this.removeUser.bind(this, user.id, false)}>Yes</Button>
            </Modal.Footer>
          </Modal.Dialog>
        }
      </ListGroupItem>
    );
  }
}

export default Users;