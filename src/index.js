import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Config from 'react-global-configuration';

import App from './app.js';

import Home from './components/home';
import Courses from './components/courses';
import Login from './components/auth/login';
import Logout from './components/auth/logout';
import SignUp from './components/auth/signup';
import Error404 from './components/error404';

import './config';
import { fetchWithHeaders } from './helper';
import WebStorage from './webstorage';

ReactDOM.render(
  <BrowserRouter>
    <App>
      <Switch>
        <Route exact
               path="/"
               component={Home} />
        <Route exact
               path="/courses"
               component={Courses} />
        <Route exact
               path="/login(/?)"
               component={Login} />
        <Route exact
               path="/signup(/?)"
               component={SignUp} />
        <Route exact
               path="/logout(/?)"
               component={Logout} />

        <Route component={Error404} />
      </Switch>
    </App>
  </BrowserRouter>,
  document.getElementById('studentManagementAppRoot')
);
