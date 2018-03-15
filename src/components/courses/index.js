import React, {Component} from 'react';
import Config from 'react-global-configuration';
import {fetchWithHeaders} from '../../helper';
import { Button, ListGroup, ListGroupItem, Glyphicon, Modal } from 'react-bootstrap';
import Users from '../users';

class Courses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: []
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
   * @desc Enroll a course with {courseId}
   *
   */
  enrollCourse = (courseId) => {
    fetchWithHeaders('/courses/' + courseId + '/enroll/', 'PUT', null, {}).then((response) => {
      if (response.success) {
        var courses = this.state.courses.slice();

        for(var course of courses) {
          if (course.id === courseId) {
            course.users = response.users;
            course.is_available = response.is_available;
            course.is_enrolled = true;
            break;
          }
        }

        this.setState({courses: courses});
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
    var _userId = Config.get('userId');

    if (userId !== null) {
      formData['user_id'] = userId;
    } else {
      userId = parseInt(_userId, 10);
    }

    fetchWithHeaders('/courses/' + courseId + '/leave/', 'PUT', null, JSON.stringify(formData)).then((response) => {
      if (response.success) {
        var courses = this.state.courses.slice();

        for (var course of courses) {
          if (course.id === courseId) {
            const courseUsers = course.users.filter((user) => { return user.id !== userId });
            course.users = courseUsers;
            course.is_available = true;
            course.is_enrolled = false;
            break;
          }
        }

        this.setState({ courses: courses });
      } else {
        alert(response.message);
      }
    });
  }

  componentWillMount = () => {
    this.fetchCourses();
  }

  /**
   * @desc Removes the deleted course with {courseId} from {state.courses}
   *
   */
  removeCourse = (courseId) => {
    var courses = this.state.courses.filter((course) => { return course.id !== courseId });
    this.setState({courses: courses});
  }

  render = () => {
    const coursesListGroupItems = this.state.courses.map((course, index) => {
      return(
        <CourseItem key={index} course={course} enrollCourse={this.enrollCourse} leaveCourse={this.leaveCourse} removeCourse={this.removeCourse} />
      );
    });

    return(
      <div className="course-list">
        <ListGroup>
          { coursesListGroupItems }
        </ListGroup>
        { coursesListGroupItems.length === 0 && <center><strong>Enjoy your freedom. No courses!</strong></center> }
      </div>
    );
  }
}

class CourseItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseUsers: [],
      showDeleteCourseWarning: false,
      addUserModal: false,
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
  toggleStudentsModal = (courseUsers) => {
    this.setState({courseUsers: courseUsers});
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

  }

  /**
   * @desc Removes user with {userId} from {state.courseUsers}
   * @param `courseId` Course ID
   * @param `userId` User ID
   *
   */
  removeUserFromCourse = (courseId, userId) => {
    var courseUsers = this.state.courseUsers.filter((user) => { return user.id !== userId });
    this.setState({ courseUsers: courseUsers });
    this.props.leaveCourse(courseId, userId);
  }

  render = () => {
    const course = this.props.course;
    const isAdmin = Config.get('isAdmin');
    const actionBtnStyle = { margin: '-5px 2px' };

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
              onClick={this.props.leaveCourse.bind(this, course.id)}>
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
                <Modal.Header closeButton>Add User</Modal.Header>
                <Modal.Body>

                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={this.toggleAddUserModal}>Close</Button>
                  <Button bsStyle="primary" onClick={this.addUsersToCourse.bind(this, course.id)}>Save</Button>
                </Modal.Footer>
              </Modal>

              <Modal show={this.state.courseUsers.length !== 0} onHide={this.toggleStudentsModal.bind(this, [])}>
                <Modal.Header closeButton>Students List</Modal.Header>
                <Modal.Body>
                  <Users
                    users={this.state.courseUsers}
                    removeUserFromCourse={this.removeUserFromCourse}
                    courseId={course.id} />
                </Modal.Body>
                <Modal.Footer>
                  <Button bsStyle="default" onClick={this.toggleStudentsModal.bind(this, [])}>
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