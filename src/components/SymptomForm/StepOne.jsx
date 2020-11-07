import React from 'react';
import { Button, Form } from 'react-bootstrap'

import RangeBar from '../rangeBar'

import 'react-toastify/dist/ReactToastify.css';


const StepOne = ({ nextStep, symptomTitle, setSymptomTitle, painRangeValue, setPainRangeValue, setBodyPart, selectedBodyPart }) => {

  const bodyPartsList = [ 'Knee', 'Elbow', 'Back' ];

  const handleBodyPartChange = (e) => {
    const { value } = e.target;
    setBodyPart(value);
  }

  return (
    <>
      <Form.Group style={{ marginTop: '2em' }}>
        <Form.Label>Symptom Title</Form.Label> 
        <Form.Control type="text" placeholder="Insert here a title..." value={symptomTitle} onChange={(e) => { setSymptomTitle(e.target.value) }}/> 
      </Form.Group>
      
      <Form.Group style={{ marginTop: '2em' }}>
        <Form.Label> Where do you feel pain? </Form.Label>
        <Form.Control defaultValue={selectedBodyPart} placeholder='Choose...' as="select" className="my-1 mr-sm-2" id="bodyPartSelect" onChange={(e) => { handleBodyPartChange(e) }} custom>
          {bodyPartsList.map((currentBodyPart, index) => {
            return <option value={currentBodyPart} key={index}> {currentBodyPart} </option>
          })}
        </Form.Control>
      </Form.Group>

      <Form.Group style={{ marginTop: '2em' }}>
        <Form.Label>How much pain do you feel?</Form.Label>
        <RangeBar id="painRangeID" setPainRangeValue={setPainRangeValue} painRangeValue={painRangeValue} />
      </Form.Group>

      <Button 
          id='addNewSymptomButton'
          variant="success"
          type="submit"
          style={{ marginTop: '2em' }}
          onClick={(e) => { e.preventDefault(); nextStep(); }}
        >
          Next
        </Button>
    </>
  );
}

export default StepOne;