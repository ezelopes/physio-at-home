import React, { memo } from 'react';
import logo from '../images/homepage_logo.png'

const HomePage = () => {
  return (
    <>
      <img alt='Logo' src={logo} id='homepagelogo' />
    </>
  );
}

export default memo(HomePage);