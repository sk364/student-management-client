import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { Nav, NavItem, Navbar, NavDropdown, MenuItem } from 'react-bootstrap';

class NavHeader extends Component {
  render = () => {
    return(
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
          <Nav pullRight>
            <NavItem eventKey={1} href="/change-password">
              Change Password
            </NavItem>
            <NavItem eventKey={2} href="/logout">
              Logout
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavHeader;