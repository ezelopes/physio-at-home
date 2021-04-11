import React, { memo, useState, useRef } from 'react';
import { useEffect } from 'react';

const RangeBar = ({ id, setPainRangeValue, painRangeValue }) => {
  const inactiveColor = '#EFEFEF'
  const min = 0;
  const max = 10;
  
  const inputRef = useRef();
  const bubbleRef = useRef();
  const [rangeBarValue, setRangeBarValue] = useState(painRangeValue);

  useEffect(() => {
    const activeColor = getColor((painRangeValue / max));

    const progress = (painRangeValue / max) * 100 + '%';
    const newBackgroundStyle = `linear-gradient(90deg, ${activeColor} 0% ${progress}, ${inactiveColor} ${progress} 100%)`
    inputRef.current.style.background = newBackgroundStyle
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const styleInput = { background: `linear-gradient(90deg, #FF0000 0% 0%, ${inactiveColor} 0% 100%)` }
 
  const handleChange = (event) => {
    const newValue = event.target.value
    const activeColor = getColor((newValue / max));

    const progress = (newValue / max) * 100 + '%'
    setRangeBarValue(newValue)
    setPainRangeValue(newValue)
    const newBackgroundStyle = `linear-gradient(90deg, ${activeColor} 0% ${progress}, ${inactiveColor} ${progress} 100%)`
    inputRef.current.style.background = newBackgroundStyle
  }

  const getColor = (value) => {
    var hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
  }

    return (
      <div style={{ position: 'relative', textAlign: 'center' }}>
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
        <div ref={bubbleRef} className='bubbleRangeBar'> 
          {rangeBarValue}
        </div>
      </div>
    )
};

export default memo(RangeBar);