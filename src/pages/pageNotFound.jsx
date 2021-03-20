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
    <>
      <h2> 404 - PAGE NOT FOUND! </h2>
      <h2> Looks like you followed a broken link or entered a URL that does not exist on this site </h2>
      <Button className='first-element' onClick={() => { props.history.push('/'); }}> HOME PAGE </Button>
    </>
  );
};

PageNotFound.propTypes = {
  history: PropTypes.string.isRequired,
};

export default memo(PageNotFound);
