import React from "react";
//import ReactDOM from "react-dom";

// small browser library that helps decoding JWTs token which are Base64Url encoded
// https://www.npmjs.com/package/jwt-decode
import jwt_decode from "jwt-decode";

// sets auth header for all requests
import setAuthToken from "./utils/setAuthToken";

// library lets you easily manage session history anywhere JavaScript runs
// https://www.npmjs.com/package/history
import { createBrowserHistory } from "history";


import { Router, Route, Switch } from "react-router";

import { setCurrentUser, logoutUser } from "./actions/authActions";

// maintain application state via store
// https://redux.js.org/tutorials/essentials/part-1-overview-concepts
import { Provider } from "react-redux";
import store from "./store";

import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
//import LoginPage from "views/LoginPage/LoginPage.js";
import Login from "views/Login/Login.js";

import "assets/scss/material-kit-pro-react.scss?v=1.9.0";

// pages for this product
import LandingPage from "views/LandingPage/LandingPage.js";

import "./App.css";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Redirect to login
    window.location.href = "./login";
  }
}

var hist = createBrowserHistory();

function App() {
  return (
  <Provider store={store}>
    <Router history={hist}>
      <Route exact path="/login" component={Login} />
      <Switch>
        <PrivateRoute exact path="/landing-page" component={LandingPage} />
        <PrivateRoute exact path="/" component={LandingPage} />
      </Switch>
    </Router>
  </Provider>
  );
}
export default App;
