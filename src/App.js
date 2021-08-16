import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AuthRoute from "./AuthRoute";
import Home from "./Home/Home";
import Login from "./Login/Login";
import Signup from "./Signup/Signup";
// const fs = require("fs");

// const file = fs.readFileSync("../test");

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route exact path="/">
          <Login />
        </Route>
        <Route path="/.well-known/acme-challenge/6fHZXq3unjQfmHxdEFwPuR2iUwzOEItHdqxSlLyPBf0">
          <p>
            6fHZXq3unjQfmHxdEFwPuR2iUwzOEItHdqxSlLyPBf0.que1Rpoum2rbib_LYPfEuYqYxPdm-tGHaTgtthWP_x8
          </p>
        </Route>
        <AuthRoute path="/home" component={Home} />
        {/* <Route path="/register">
          <Register />
        </Route>
        <AuthRoute  /> */}
        {/* <AuthRoute path="/main" exact component={Main1} />
        <AuthRoute path="/main/hotels" exact component={Main2} /> */}
        {/* <Route exact path="/">
          <Home />
        </Route> */}
      </Switch>
    </Router>
  );
}

export default App;
