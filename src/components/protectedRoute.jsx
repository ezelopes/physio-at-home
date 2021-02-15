import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Component created to protect pages that require authentication
 * @param {Object} component If logged in, load this component
 * @param {Object} redirectPath If logged out, redirect to given path
 */
const ProtectedRoute = ({
  component: Component,
  redirectPath: RedirectPath,
  activated,
  authenticated,
  roles,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (authenticated && roles.expectedRole === roles.currentRole) {
          // if (!activated) return (<AccountSetUp {...props} /> <Redirect to={{ pathname: '/setUpAccount'}} />)
          return <Component {...props} />;
        } else {
          return (
            <Redirect to={{ pathname: RedirectPath }} />
          );
        }
      }}
    />
  );
};

ProtectedRoute.propTypes = {
  redirectPath: PropTypes.string.isRequired,
};

export default ProtectedRoute;
