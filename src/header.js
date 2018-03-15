import React, {Component} from 'react';
import Config from 'react-global-configuration';
import {Link} from 'react-router-dom';
import { Button, Nav, NavItem, Navbar, Modal, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import {fetchWithHeaders} from './helper';

class NavHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showChangePasswordModal: false
    };
  }

  /**
   * @desc Show/hide change password modal
   *
   */
  toggleChangePasswordModal = (event=null) => {
    event && event.preventDefault();

    this.setState({
      showChangePasswordModal: !this.state.showChangePasswordModal
    });
  }

  render = () => {
    const isAdmin = Config.get('isAdmin');

    return(
      <div className="Header">
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Student Management</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} href="/courses">
                Courses
              </NavItem>
            </Nav>
            {
              isAdmin &&
              <Nav>
                <NavItem eventKey={1} href="/users">Users</NavItem>
              </Nav>
            }
            <Nav pullRight>
              <NavItem eventKey={1} onClick={this.toggleChangePasswordModal}>
                Change Password
              </NavItem>
              <NavItem eventKey={2} href="/logout">
                Logout
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        {
          this.state.showChangePasswordModal &&
          <ChangePasswordModal toggleModal={this.toggleChangePasswordModal} />
        }
      </div>
    );
  }
}

class ChangePasswordModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      errorMsg: ''
    };
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
   * @desc Validates passwords and submits form to API
   *
   */
  submitNewPassword = (currentPassword, newPassword, confirmPassword) => {
    if (newPassword.length < 8 || confirmPassword.length < 8) {
      this.setState({
        errorMsg: 'Password should be atleast 8 characters long.'
      });
    } else if (newPassword !== confirmPassword) {
      this.setState({
        errorMsg: 'Passwords do not match.'
      });
    } else {
      var formData = JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      });

      fetchWithHeaders('/change-password/', 'POST', null, formData).then((response) => {
        if (response.success) {
          this.props.toggleModal();
          alert(response.message);
        } else {
          this.setState({
            errorMsg: response.message
          });
        }
      });
    }
  }

  render = () => {
    const toggleModal = this.props.toggleModal;
    const currentPassword = this.state.currentPassword;
    const newPassword = this.state.newPassword;
    const confirmPassword = this.state.confirmPassword;

    return(
      <Modal.Dialog>
        <Modal.Header><Modal.Title>Change Password</Modal.Title></Modal.Header>
        <Modal.Body>
          <FormGroup controlId="currentPassword" bsSize="md">
            <ControlLabel>Current Password</ControlLabel>
            <FormControl
              autoFocus
              type="password"
              value={this.state.currentPassword}
              onChange={this.handleChange} />
          </FormGroup>

          <FormGroup controlId="newPassword" bsSize="md">
            <ControlLabel>New Password</ControlLabel>
            <FormControl
              type="password"
              value={this.state.newPassword}
              onChange={this.handleChange} />
          </FormGroup>

          <FormGroup controlId="confirmPassword" bsSize="md">
            <ControlLabel>Confirm Password</ControlLabel>
            <FormControl
              type="password"
              value={this.state.confirmPassword}
              onChange={this.handleChange} />
          </FormGroup>

          <span style={ {color: '#ff0000'} }>{ this.state.errorMsg }</span>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={toggleModal}>Close</Button>
          <Button
            bsStyle="primary"
            onClick={this.submitNewPassword.bind(this, currentPassword, newPassword, confirmPassword)}
            disabled={!currentPassword || !newPassword || !confirmPassword}>
              Save
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}

export default NavHeader;