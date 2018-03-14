import React, {Component} from 'react';
import Config from 'react-global-configuration';
import {fetchWithHeaders} from '../../helper';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';

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
  leaveCourse = (courseId) => {
    fetchWithHeaders('/courses/' + courseId + '/leave/', 'PUT', null, {}).then((response) => {
      if (response.success) {
        var courses = this.state.courses.slice();

        for (var course of courses) {
          if (course.id === courseId) {
            course.users = response.users;
            course.is_available = true;
            course.is_enrolled = false;
            break;
          }
        }

        this.setState({courses: courses});
      } else {
        alert(response.message);
      }
    });
  }

  componentWillMount = () => {
    this.fetchCourses();
  }

  render = () => {
    const userId = Config.get('userId');
    const coursesListGroupItems = this.state.courses.map((course, index) => {
      return(
        <CourseItem key={index} course={course} enrollCourse={this.enrollCourse} leaveCourse={this.leaveCourse} />        
      );
    });

    return(
      <div className="course-list">
        <ListGroup>
          { coursesListGroupItems }
        </ListGroup>
      </div>
    );
  }
}

class CourseItem extends Component {
  render = () => {
    const course = this.props.course;

    return(
      <ListGroupItem>
        <span>{ course.name }</span>
        { !course.is_enrolled ?
          <Button bsStyle={course.is_available ? "success" : "default"}
                  bsSize="sm"
                  className="pull-right"
                  style={ {margin: '-5px auto'} }
                  disabled={!course.is_available}
                  onClick={this.props.enrollCourse.bind(this, course.id)}>
            { course.is_available ? "Enroll" : "Full" }
          </Button> :
          <Button bsStyle="danger"
                  bsSize="sm"
                  className="pull-right"
                  style={ {margin: '-5px auto'} }
                  onClick={this.props.leaveCourse.bind(this, course.id)}>
            Leave
          </Button>
        }
      </ListGroupItem>
    );
  }
}

export default Courses;