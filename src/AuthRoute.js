import axios from "axios";
import React, { useState } from "react";
import { Route, Redirect, useHistory } from "react-router-dom";

const AuthRoute = ({ component: Component, ...rest }) => {
  const history = useHistory();
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;
  const [auth, setauth] = useState(true);
  const token = localStorage.getItem("token");

  axios
    .get(BASE_URL + "/augmont/isAuth", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      if (res.data !== "OK") {
        setauth(false);
        localStorage.clear();
        history.push("/");
      }
    })
    .catch((error) => {
      console.log(error);
      setauth(false);
      localStorage.clear();
      history.push("/");
    });

  return (
    <Route
      {...rest}
      render={(props) =>
        auth ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default AuthRoute;
