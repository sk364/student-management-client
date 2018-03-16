import React, {Component} from 'react';
import Config from 'react-global-configuration';
import {fetchWithHeaders} from '../../helper';
import { Button, ListGroup, ListGroupItem, Glyphicon, Modal, Checkbox, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import Users from '../users';

class Courses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      users: [],
      showAddCourseModal: false,
      newCourseName: '',
    };
  }

  /**
   * @desc Get all courses
   *
   */
  fetchCourses = () => {
    fetchWithHeaders('/courses').then((response) => {
      this.setState({courses: response});
    });
  }

  /**
   * @desc Get all users
   *
   */
  fetchUsers = () => {
    fetchWithHeaders('/students/').then((response) => {
      this.setState({users: response});
    });
  }

  /**
   * @desc Enroll a course with {courseId}
   *
   */
  enrollCourse = (courseId) => {
    fetchWithHeaders('/courses/' + courseId + '/enroll/', 'PUT', null, {}).then((response) => {
      if (response.success) {
        this.updateCourseUsers(courseId, response.users, response.is_available, true);
      } else {
        alert(response.message);
      }
    });
  }  

  /**
   * @desc Leave a course with {courseId}
   *
   */
  leaveCourse = (courseId, userId=null) => {
    var formData = {};

    if (userId !== null) {
      formData = {'user_ids': [userId]};
      formData = JSON.stringify(formData);
    }

    fetchWithHeaders('/courses/' + courseId + '/leave/', 'PUT', null, formData).then((response) => {
      if (response.success) {
        this.updateCourseUsers(courseId, response.users, true, false);
      } else {
        alert(response.message);
      }
    });
  }

  /**
   * @desc Updates users in course with {courseId}
   * @param `courseId` Course ID
   * @param `users` Updated users list
   * @param `isAvailable` Is Course Available?
   * @param `isEnrolled` Is User Enrolled?
   *
   */
  updateCourseUsers = (courseId, users, isAvailable, isEnrolled) => {
    var courses = this.state.courses.slice();

    for (var course of courses) {
      if (course.id === courseId) {
        course.users = users;
        course.is_available = isAvailable;
        course.is_enrolled = isEnrolled;
        break;
      }
    }

    this.setState({courses: courses});
  }

  componentWillMount = () => {
    this.fetchCourses();
    if (Config.get('isAdmin')) {
      this.fetchUsers();
    }
  }

  /**
   * @desc Removes the deleted course with {courseId} from {state.courses}
   *
   */
  removeCourse = (courseId) => {
    var courses = this.state.courses.filter((course) => { return course.id !== courseId });
    this.setState({courses: courses});
  }

  /**
   * @desc Toggles {state.showAddCourseModal}
   *
   */
  toggleAddCourseModal = () => {
    this.setState({showAddCourseModal: !this.state.showAddCourseModal});
  }

  /**
   * @desc Handles input change
   *
   */
  handleInputChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  /**
   * @desc Create new course with name {state.newCourseName}
   *
   */
  addCourse = () => {
    var formData = JSON.stringify({'name': this.state.newCourseName});

    fetchWithHeaders('/courses/', 'POST', null, formData).then((response) => {
      var courses = this.state.courses.slice();
      courses.push(response);
      this.setState({courses: courses});
      this.toggleAddCourseModal();
    });
  }

  render = () => {
    const isAdmin = Config.get('isAdmin');
    const coursesListGroupItems = this.state.courses.map((course, index) => {
      return(
        <CourseItem
          key={index}
          course={course}
          enrollCourse={this.enrollCourse}
          leaveCourse={this.leaveCourse}
          removeCourse={this.removeCourse}
          users={this.state.users}
          updateCourseUsers={this.updateCourseUsers} />
      );
    });

    const subHeaderStyle = {margin: '5px auto'};

    return(
      <div className="course-list">
        <div style={subHeaderStyle}>
          <div style={{display: 'inline'}}><strong>Courses</strong></div>
          {
            isAdmin &&
            <Button
              bsStyle="primary"
              bsSize="xs"
              className="pull-right"
              onClick={this.toggleAddCourseModal}
              >
              Add Course
            </Button>
          }
        </div>
        <ListGroup>
          { coursesListGroupItems }
        </ListGroup>

        <Modal show={this.state.showAddCourseModal} onHide={this.toggleAddCourseModal}>
          <Modal.Header>Add Course</Modal.Header>
          <Modal.Body>
            <FormGroup controlId="newCourseName">
              <ControlLabel>Course Name</ControlLabel>
              <FormControl
                autoFocus
                type="text"
                value={this.state.newCourseName}
                onChange={this.handleInputChange} />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.toggleAddCourseModal}>Close</Button>
            <Button
              bsStyle="primary"
              disabled={this.state.newCourseName.length === 0}
              onClick={this.addCourse}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        { coursesListGroupItems.length === 0 && <center><strong>Enjoy your freedom. No courses!</strong></center> }
      </div>
    );
  }
}

class CourseItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: null,
      courseUsers: [],
      showStudentsModal: false,
      showDeleteCourseWarning: false,
      addUserModal: false,
      selectedUsers: [],
    };
  }

  /**
   * @desc Toggles {state.addUserModal}
   *
   */
  toggleAddUserModal = () => {
    this.setState({addUserModal: !this.state.addUserModal});
  }

  /**
   * @desc Opens a modal containing list of students
   * @param `courseUsers` list of users enrolled in course
   *
   */
  toggleStudentsModal = () => {
    this.setState({showStudentsModal: !this.state.showStudentsModal});
  }

  /**
   * @desc Toggles {state.showDeleteCourseWarning}
   *
   */
  toggleDeleteCourseWarning = () => {
    this.setState({showDeleteCourseWarning: !this.state.showDeleteCourseWarning});
  }

  /**
   * @desc Removes the course with {courseId}
   *
   */
  removeCourse = (courseId, showWarning=true) => {
    if (showWarning) {
      this.toggleDeleteCourseWarning();
      return;
    }

    fetchWithHeaders('/courses/' + courseId, 'DELETE').then((response) => {
      alert('Course Removed Successfully!');
      this.props.removeCourse(courseId);
    });
  }

  /**
   * @desc Adds users to course with {courseId}
   *
   */
  addUsersToCourse = (courseId) => {
    const formData = JSON.stringify({user_ids: this.state.selectedUsers});
    fetchWithHeaders('/courses/' + courseId + '/enroll/', 'PUT', null, formData).then((response) => {
      this.toggleAddUserModal();
      this.props.updateCourseUsers(courseId, response.users, response.is_available);
      this.setState({selectedUsers: []});
    });
  }

  /**
   * @desc Removes user with {userId} from {state.courseUsers}
   * @param `courseId` Course ID
   * @param `userId` User ID
   *
   */
  removeUserFromCourse = (courseId, userId) => {
    this.props.leaveCourse(courseId, userId);
  }

  /**
   * @desc Handles student checkbox change
   *
   */
  handleStudentCheckboxChange = (event) => {
    const userId = event.target.value;
    const isChecked = event.target.checked;
    var selectedUsers = this.state.selectedUsers;

    if (isChecked) {
      selectedUsers.push(userId);
    } else {
      selectedUsers.splice(selectedUsers.indexOf(userId), 1);
    }

    this.setState({ selectedUsers: selectedUsers });
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      course: nextProps.course,
      courseUsers: nextProps.course.users
    });
  }

  componentWillMount = () => {
    this.setState({
      course: this.props.course,
      courseUsers: this.props.course.users
    });
  }

  render = () => {
    const course = this.state.course;
    const isAdmin = Config.get('isAdmin');
    const actionBtnStyle = { margin: '-5px 2px' };
    const users = this.props.users.filter((user) => {
      for(var courseUser of course.users) {
        if (user.id === courseUser.id) {
          return false;
        }
      }
      return true;
    });
    const courseUsers = this.state.courseUsers;
    const selectedUsers = this.state.selectedUsers;
    const checkboxDisabled = (selectedUsers.length + course.users.length) > 4;
    const usersCheckboxList = users.map((user, index) => {
      return (
        <Checkbox
          key={user.id}
          title={user.id.toString()}
          value={user.id}
          onChange={this.handleStudentCheckboxChange}
          disabled={checkboxDisabled}>
          { user.first_name + ' ' + user.last_name }
        </Checkbox>
      );
    })

    return(
      <ListGroupItem>
        <span>{ course.name }</span>
        {
          !isAdmin ?
          (
            !course.is_enrolled ?
            <Button
              bsStyle={course.is_available ? "success" : "default"}
              bsSize="sm"
              className="pull-right"
              style={actionBtnStyle}
              disabled={!course.is_available}
              onClick={this.props.enrollCourse.bind(this, course.id)}>
              { course.is_available ? "Enroll" : "Full" }
            </Button> :
            <Button
              bsStyle="danger"
              bsSize="sm"
              className="pull-right"
              style={actionBtnStyle}
              onClick={this.props.leaveCourse.bind(this, course.id, null)}>
              Leave
            </Button>
          ) : (
            <span>
              <Button
                bsStyle="danger"
                bsSize="sm"
                className="pull-right"
                style={actionBtnStyle}
                onClick={this.removeCourse.bind(this, course.id)}>
                <Glyphicon glyph="trash" />
              </Button>
              <Button
                bsStyle="default"
                bsSize="sm"
                className="pull-right"
                disabled={course.users.length === 0}
                style={actionBtnStyle}
                onClick={this.toggleStudentsModal.bind(this, course.users)}>
                { course.users.length !== 0 ? "List Students" : "0 students" }
              </Button>
              <Button
                bsStyle="default"
                bsSize="sm"
                className="pull-right"
                disabled={!course.is_available}
                style={actionBtnStyle}
                onClick={this.toggleAddUserModal}>
                { course.is_available ? "Add Students" : "Course Full" }
              </Button>

              <Modal show={this.state.addUserModal} onHide={this.toggleAddUserModal}>
                <Modal.Header closeButton>Add Student</Modal.Header>
                <Modal.Body>
                  <FormGroup controlId="users">
                    <ControlLabel>Students</ControlLabel>
                    { usersCheckboxList }
                  </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={this.toggleAddUserModal}>Close</Button>
                  <Button
                    bsStyle="primary"
                    disabled={this.state.selectedUsers.length === 0}
                    onClick={this.addUsersToCourse.bind(this, course.id)}>
                    Save
                  </Button>
                </Modal.Footer>
              </Modal>

              <Modal show={this.state.showStudentsModal} onHide={this.toggleStudentsModal}>
                <Modal.Header closeButton>Students List</Modal.Header>
                <Modal.Body>
                  <Users
                    users={courseUsers}
                    removeUserFromCourse={this.removeUserFromCourse}
                    courseId={course.id} />
                </Modal.Body>
                <Modal.Footer>
                  <Button bsStyle="default" onClick={this.toggleStudentsModal}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>

              { this.state.showDeleteCourseWarning &&
                <Modal.Dialog>
                  <Modal.Header closeButton>
                    Confirm Delete?
                  </Modal.Header>
                  <Modal.Body>
                    Are you sure you want to delete?
                  </Modal.Body>
                  <Modal.Footer>
                    <Button onClick={this.toggleDeleteCourseWarning}>No</Button>
                    <Button bsStyle="danger" onClick={this.removeCourse.bind(this, course.id, false)}>Yes</Button>
                  </Modal.Footer>
                </Modal.Dialog>
              }
            </span>
          )
        }
      </ListGroupItem>
    );
  }
}

export default Courses;