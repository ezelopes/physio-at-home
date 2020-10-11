import React, { useState, useEffect } from 'react';

const KneeImage = () => {

  const [kneePart, setKneePart] = useState(null);
  const kneePartsList = ['KNEE CAP', 'UPPER LEFT KNEE', 'LOWER LEFT KNEE', 'UPPER RIGHT KNEE', 'LOWER RIGHT KNEE']
  const width = '150'; const height = '150';
  const halfWidth = width/2; const halfHeight = height/2;

  const style = {
    cursor: 'pointer'
  }

  useEffect(() => {
  }, [])

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
    setKneePart(selectedKneePart)
  }

  const handleMouseMove = (e) => {
    const xCoordinate = e.nativeEvent.offsetX;
    const yCoordinate = e.nativeEvent.offsetY;
    const pointerPosition = getPointerPosition(xCoordinate, yCoordinate);
    // console.log(pointerPosition);
  }

  return (
    <>
      {/* <h2>KNEE IMAGE</h2> */}
      <img
        src={require('../images/knee.png')}
        alt='knee'
        width={width}
        height={height}
        onClick={(e) => handleImageClick(e)} style={style}
        onMouseMove={(e) => handleMouseMove(e)}
      />
      <div id='selectedKneePart' style={{ marginTop: '2em', fontFamily: 'Roboto' }}>
        {kneePart ? `YOU SELECTED: ${kneePart}` : 'CLICK ON THE ABOVE IMAGE TO SELECT WHERE YOU FEEL PAIN'}
      </div>
    </>
  );
};


export default KneeImage;
