import React, { memo, useState } from 'react';

const KneeImage = ({ setSpecificBodyPart, specificBodyPart }) => {

  const [kneePart, setKneePart] = useState(specificBodyPart);
  const kneePartsList = ['KNEE CAP', 'UPPER LEFT KNEE', 'LOWER LEFT KNEE', 'UPPER RIGHT KNEE', 'LOWER RIGHT KNEE']
  const width = '150'; const height = '150';
  const halfWidth = width/2; const halfHeight = height/2;

  const getPointerPosition = (x, y) => {
    if ((x > (halfWidth - width*0.3) && x <= ((halfWidth + width*0.3))) && (y > (halfHeight - height*0.3) && y <= (halfHeight + height*0.3)))
      return kneePartsList[0];
    else if (x < halfWidth && y < halfHeight)
      return kneePartsList[1];
    else if (x < halfWidth && y >= halfHeight)
      return kneePartsList[2];
    else if (x >= halfWidth && y < halfHeight)
      return kneePartsList[3];
    else if (x >= halfWidth && y >= halfHeight)
      return kneePartsList[4];
  }

  const handleImageClick = (e) => {
    const xCoordinate = e.nativeEvent.offsetX;
    const yCoordinate = e.nativeEvent.offsetY;
    const selectedKneePart = getPointerPosition(xCoordinate, yCoordinate);
    setKneePart(selectedKneePart);
    setSpecificBodyPart(selectedKneePart);
  }

  return (
    <>
      <img
        src={require('../images/knee.png')}
        alt='knee'
        width={width}
        height={height}
        onClick={(e) => handleImageClick(e)} 
        className='body-part-image'
      />

      <br />
      <label className={`selectedBodyPartLabel ${kneePart ? 'selected' : ''}`}> 
        { kneePart
          ? `YOU SELECTED: ${kneePart}`
          : 'CLICK ON THE ABOVE IMAGE TO SELECT WHERE YOU FEEL PAIN'
        }
      </label>

    </>
  );
};


export default memo(KneeImage);
