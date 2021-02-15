import React, { memo } from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

/**
 * Customised page when URL does not exist.
 * Link to return to home page
 * @param {Object} props
 */
const PageNotFound = (props) => {
  return (
    <h2>
      <div> 404 - PAGE NOT FOUND! </div>
      <div> Looks like you followed a broken link or entered a URL that does not exist on this site </div>
      <Button onClick={() => { props.history.push('/'); }}> HOME PAGE </Button>
    </h2>
  );
};

PageNotFound.propTypes = {
  history: PropTypes.string.isRequired,
};

export default memo(PageNotFound);
