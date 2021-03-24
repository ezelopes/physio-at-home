import React, { memo, useState, useRef } from 'react';
import kneeImageJPG from '../../images/knee.png'

import IconWithMessage from '../iconWithMessage'

const KneeImage = ({ specificBodyPart, setSpecificBodyPart }) => {

  const toolTipMessage = {
    NonEmptyListDetails: 'Click again on the red dot to remove from the list',
    EmptyListDetails: 'Click Red Dot above to add to the list'
  }

  const width = '400'; const height = '300'; const radius = 10;

  const kneeHotSpots = [
    { x: width/2, y: height/2, radius, tip: 'Patella' },
    { x: width/5, y: height/2, radius, tip: 'Lat Inside' },
    { x: width/1.4, y: height/2, radius, tip: 'Lat Outside' },
    { x: width/2, y: height/5, radius, tip: 'Quad Tendon'  },
    { x: width/2, y: height/1.2, radius, tip: 'Tibial Tendon' },
  ];

  const [kneePart, setKneePart] = useState(specificBodyPart);

  const kneeRef = useRef(null);
  const canvasRef = useRef('canvas');

  const getHotSpot = (x, y) => {
    const selectedHotspot = kneeHotSpots.filter((currentHotspot) => {
      const dx = x - currentHotspot.x;
      const dy = y - currentHotspot.y;
      if (dx * dx + dy * dy < currentHotspot.radius * currentHotspot.radius) return currentHotspot;
      else return null;
    })
    if (selectedHotspot[0]) return selectedHotspot[0].tip
    else return null;
  }

  const handleImageClick = (e) => {
    const xCoordinate = e.nativeEvent.offsetX;
    const yCoordinate = e.nativeEvent.offsetY;

    const selectedKneePart = getHotSpot(xCoordinate, yCoordinate);
    if (!kneePart.includes(selectedKneePart) && selectedKneePart) kneePart.push(selectedKneePart)
    else {
      const index = kneePart.indexOf(selectedKneePart);
      if (index > -1) {
        kneePart.splice(index, 1);
      }
    }

    setKneePart([...kneePart]);
    setSpecificBodyPart([...kneePart]);
  }

  const handleMouseMove = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const ctx = canvasRef.current.getContext("2d");
    const xCoordinate = e.nativeEvent.offsetX;
    const yCoordinate = e.nativeEvent.offsetY;

    ctx.clearRect(0, 0, width, height);
    setUpCanvas();
    ctx.font = '1.2em Arial Bold';
    for (let i = 0; i < kneeHotSpots.length; i++) {
      const h = kneeHotSpots[i];
      const dx = xCoordinate - h.x;
      const dy = yCoordinate - h.y;
      if (dx * dx + dy * dy < h.radius * h.radius) {
        ctx.fillStyle = "#000000";
        ctx.fillText(h.tip, (h.x + h.radius), h.y);
      }
    }
  }

  const setUpCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.drawImage(kneeRef.current, 50, 0, width-100, height)

    ctx.fillStyle = "#FF0000";

    for (var i = 0; i < kneeHotSpots.length; i++) {
      var h = kneeHotSpots[i];
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
  }

  return (
    <>
      <img
        onLoad={setUpCanvas}
        ref={kneeRef}
        src={kneeImageJPG}
        alt='knee'
        className='body-part-image'
      />

      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height} 
        style={{ border: '1px solid #d3d3d3', cursor: 'pointer', borderRadius: '8px' }} 
        onClick={(e) => handleImageClick(e)}
        onMouseMove={(e) => { handleMouseMove(e) }}
      />

      <br />

      <label className='selectedBodyPartLabel'> 
         <> YOU SELECTED: <IconWithMessage message={
           kneePart.length === 0 ?  toolTipMessage.EmptyListDetails : toolTipMessage.NonEmptyListDetails
          } /> 
          { 
            kneePart.map((part, index) => { return (<div key={index}> {part} </div>) } )
          }
        </>
      </label>

    </>
  );
};

export default memo(KneeImage);
