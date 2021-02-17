import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import AccountSetUp from '../../pages/accountSetUpPage'

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
        if (authenticated && roles.expectedRole.includes(roles.currentRole) && activated) return <Component role={roles.currentRole} activated={activated} {...props} />;

        else if (authenticated && roles.expectedRole.includes(roles.currentRole) && !activated) 
          return (<AccountSetUp role={roles.currentRole} activated={activated} />)
        
        else return ( <Redirect to={{ pathname: RedirectPath }} /> );
      }}
    />
  );
};

ProtectedRoute.propTypes = {
  redirectPath: PropTypes.string.isRequired,
};

export default ProtectedRoute;
