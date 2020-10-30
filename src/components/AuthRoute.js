import React from "react";
import { Route, Redirect } from "react-router-dom";

/*
const AuthRoute = ({ authenticated, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      authenticated === true ? (
        <Redirect to="/home" />
      ) : (
        <Component {...props} />
      )
    }
  />
);

export default AuthRoute;
*/

class AuthRoute extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { authenticated, component: Component, ...rest } = this.props;

    return (
      <Route
        {...rest}
        render={(props) =>
          authenticated === true ? (
            <Redirect to="/home" />
          ) : (
            <Component {...props} />
          )
        }
      />
    );
  }
}
export default AuthRoute;
