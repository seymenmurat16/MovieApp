import React from 'react';
import {
    Route,
    Redirect
  } from "react-router-dom";
  
  
const AdminRouter = ({ component: Component, authenticated,currentUser, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        authenticated && currentUser ? currentUser.role : 1==1 == "Admin" ? (
          <Component {...rest} {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: props.location }
            }}
          />
        )
      }
    />
);
  
export default AdminRouter