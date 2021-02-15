import React, { memo } from 'react';

const ColoredLine = ({ color }) => {
  return (
    <hr
      style={{
          color: color,
          backgroundColor: color,
      }}
  />)
};

export default memo(ColoredLine);