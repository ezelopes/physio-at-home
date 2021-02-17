import React, { memo, useState, useRef } from 'react';
import elbowImageJPG from '../../images/elbow.jpg'

const ElbowImage = ({ specificBodyPart, setSpecificBodyPart }) => {

  const width = '500'; const height = '300'; const radius = 10;

  const elbowHotSpots = [
    { x: width/5, y: height/2, radius, tip: 'Wrist' },
    { x: width/1.4, y: height/2, radius, tip: 'Joint' },
    { x: width/2, y: height/2, radius, tip: 'Radius' },
    { x: width/2, y: height/1.5, radius, tip: 'Ulna' },
  ];

  const [elbowPart, setElbowPart] = useState(specificBodyPart);

  const ElbowRef = useRef(null);
  const canvasRef = useRef('canvas');

  const getHotSpot = (x, y) => {
    const selectedHotspot = elbowHotSpots.filter((currentHotspot) => {
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

    const selectedElbowPart = getHotSpot(xCoordinate, yCoordinate);
    if (!elbowPart.includes(selectedElbowPart) && selectedElbowPart) elbowPart.push(selectedElbowPart)
    else {
      const index = elbowPart.indexOf(selectedElbowPart);
      if (index > -1) {
        elbowPart.splice(index, 1);
      }
    }

    setElbowPart([...elbowPart]);
    setSpecificBodyPart([...elbowPart]);
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
    for (let i = 0; i < elbowHotSpots.length; i++) {
      const h = elbowHotSpots[i];
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
    ctx.drawImage(ElbowRef.current, 0, 0, width, height)

    ctx.fillStyle = "#FF0000";

    for (var i = 0; i < elbowHotSpots.length; i++) {
      var h = elbowHotSpots[i];
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
        ref={ElbowRef}
        src={elbowImageJPG}
        alt='Elbow'
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
         <> YOU SELECTED: 
          { 
            elbowPart.map((part, index) => { return (<div key={index}> {part} </div>) } )
          }
        </>
      </label>

    </>
  );
};

export default memo(ElbowImage);
