import React /*, { useState }*/ from 'react';

const ElbowImage = ({ setSpecificBodyPart, specificBodyPart }) => {
  return (
    <img
        src={require('../images/elbow.jpg')}
        alt='knee'
        width={150}
        height={150}
        // onClick={(e) => handleImageClick(e)} 
        style={{ cursor: 'pointer', borderRadius: '8px' }}
      />
  );
};


export default ElbowImage;