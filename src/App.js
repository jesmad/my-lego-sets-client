import React from "react";
import "./App.css";

//React-Router-Dom
import { BrowserRouter, Switch, Route } from "react-router-dom";

//JWT-Decode
import jwt_decode from "jwt-decode";

//Local Components
import AuthRoute from "./components/AuthRoute.js";
import Navbar from "./components/Navbar.js";
import Login from "./components/Login.js";
import Home from "./components/Home.js";
import Signup from "./components/Signup.js";
import User from "./components/User.js";
import SetPage from "./components/SetPage.js";

//TODO: Check if there is a user currently signed in. If there is, make sure that their JWT hasn't expired. Ultimately, this
//check will be used to redirect the user to the home page every time they try to click on the login or signup pages
let isAuthenticated;
let jwtToken = localStorage.getItem("userJWT");

if (jwtToken !== null) {
  var decoded = jwt_decode(jwtToken);
  //Date.now() => milliseconds since UNIX - "start" of time (1/1/1970)
  //decoded.exp => seconds since UNIX - "start" of time (1/1/1970)
  if (Date.now() >= decoded.exp * 1000) {
    isAuthenticated = false;
    //TODO: Look into redirection after logging in and when the token expires. Buggy atm
    //window.location.href = "/login";
  } else {
    isAuthenticated = true;
  }
} else {
  isAuthenticated = false;
}

//function App() {
class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        {/* Navbar will display the navigation bar */}
        <Navbar />
        {/* A Switch looks through its children <Route>s and the renders the first one that matches the URL*/}
        <Switch>
          {/*
          <Route
            path="/login"
            render={(props) => (
              <Login {...props} authenticated={isAuthenticated} />
            )}
          ></Route>
          <Route
            path="/signup"
            authenticated={isAuthenticated}
            render={(props) => (
              <Signup {...props} authenticated={isAuthenticated} />
            )}
          />
            */}
          <AuthRoute
            path="/login"
            authenticated={isAuthenticated}
            component={Login}
          />
          <AuthRoute
            path="/signup"
            authenticated={isAuthenticated}
            component={Signup}
          />
          <Route
            path="/home"
            render={(props) => (
              <Home {...props} authenticated={isAuthenticated} />
            )}
          />
          <Route
            path="/user/:userHandle"
            render={(props) => (
              <User {...props} authenticated={isAuthenticated} />
            )}
          />
          <Route
            path="/set/:setID"
            render={(props) => (
              <SetPage {...props} authenticated={isAuthenticated} />
            )}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
