import React, { memo } from 'react';
import { Button, Form } from 'react-bootstrap'

import RangeBar from '../rangeBar'

import 'react-toastify/dist/ReactToastify.css';


const StepOne = ({ nextStep, symptomTitle, setSymptomTitle, painRangeValue, setPainRangeValue, setBodyPart, selectedBodyPart, setRightOrLeft, rightOrLeft, setSpecificBodyPart }) => {

  const bodyPartsList = [ 'Knee', 'Elbow', 'Back' ];

  const handleBodyPartChange = (e) => {
    const { value } = e.target;
    setBodyPart(value);
    setSpecificBodyPart('');
  }

  const handleRightLeftChange = (e) => {
    const { value } = e.target;
    setRightOrLeft(value.toUpperCase())
  }

  return (
    <>
      <Form.Group className='first-element'>
        <Form.Label>Symptom Title</Form.Label> 
        <Form.Control type="text" placeholder="Insert here a title..." value={symptomTitle} onChange={(e) => { setSymptomTitle(e.target.value) }}/> 
      </Form.Group>
      
      <Form.Group>
        <Form.Label> Where do you feel pain? </Form.Label>
        <Form.Control defaultValue={selectedBodyPart} as="select" className="my-1 mr-sm-2" id="bodyPartSelect" onChange={(e) => { handleBodyPartChange(e) }} custom>
          {bodyPartsList.map((currentBodyPart, index) => {
            return <option value={currentBodyPart} key={index}> {currentBodyPart} </option>
          })}
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label> Select Right or Left </Form.Label>
        <Form.Control defaultValue={rightOrLeft} as="select" className="my-1 mr-sm-2" id="rightOrLeft" onChange={(e) => { handleRightLeftChange(e) }} custom>
           <option value={'RIGHT'} key='RIGHT'> Right </option>
           <option value={'LEFT'} key='LEFT'> Left </option>
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>How much pain do you feel?</Form.Label>
        <RangeBar id="painRangeID" setPainRangeValue={setPainRangeValue} painRangeValue={painRangeValue} />
      </Form.Group>

      <Button 
          variant="success"
          type="submit"
          className='form-button'
          onClick={(e) => { e.preventDefault(); nextStep(); }}
        >
          Next
        </Button>
    </>
  );
}

export default memo(StepOne);