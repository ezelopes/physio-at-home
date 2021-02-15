import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Component created to protect pages that require authentication
 * @param {Object} component If logged in, load this component
 * @param {Object} redirectPath If logged out, redirect to given path
 */
const GuestRoute = ({
  component: Component,
  redirectPath: RedirectPath,
  authenticated,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!authenticated) {
          return <Component {...props} />;
        }
        return (
          <Redirect to={{ pathname: RedirectPath }} />
        );
      }}
    />
  );
};

GuestRoute.propTypes = {
  redirectPath: PropTypes.string.isRequired,
};

export default GuestRoute;
