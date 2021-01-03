import React from 'react';

const ColoredLine = ({ color }) => {
  return (
    <hr
      style={{
          color: color,
          backgroundColor: color,
      }}
  />)
};

export default ColoredLine;