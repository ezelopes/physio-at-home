import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

/**
 * Customised page when URL does not exist.
 * Link to return to home page
 * @param {Object} props
 */
const PageNotFound = (props) => {
  return (
    <>
      <div> 404 - PAGE NOT FOUND! </div>
      <div> Looks like you followed a broken link or entered a URL that does not exist on this site </div>
      <Button onClick={() => { props.history.push('/'); }}> HOME PAGE </Button>
    </>
  );
};

PageNotFound.propTypes = {
  history: PropTypes.string.isRequired,
};

export default PageNotFound;
