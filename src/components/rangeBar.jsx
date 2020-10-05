import React, { useState, useRef } from 'react';

const RangeBar = ({ id }) => {
  const inactiveColor = '#EFEFEF'
  const min = 1;
  const max = 300;
  
  const inputRef = useRef();
  const [rangeBarValue, setRangeBarValue] = useState(0);
  
  const styleInput = { background: `linear-gradient(90deg, #FF0000 0% 0%, ${inactiveColor} 0% 100%)` }
 
  const handleChange = (event) => {
    const newValue = event.target.value
    const activeColor = getColor((newValue / max));

    const progress = (newValue / max) * 100 + '%'
    setRangeBarValue(newValue)
    const newBackgroundStyle = `linear-gradient(90deg, ${activeColor} 0% ${progress}, ${inactiveColor} ${progress} 100%)`
    inputRef.current.style.background = newBackgroundStyle
  }

  const getColor = (value) => {
    var hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
  }

    return (
      <div>
        <input
          id={id}
          ref={inputRef}
          className="inputR"
          name="sliderName"
          type="range"
          min={min}
          max={max}
          value={rangeBarValue}
          onChange={(e) => handleChange(e)}
          style={styleInput}
        />
        {/* <div className="label" style={{ textAlign: 'center', color: 'white' }}>
          {rangeBarValue}
        </div> */}
      </div>
    )
};

export default RangeBar;