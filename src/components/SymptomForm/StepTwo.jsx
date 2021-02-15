import React, { memo } from 'react';
import { Button, Form } from 'react-bootstrap'
import KneeImage from '../kneeImage'
import ElbowImage from '../elbowImage'

const StepTwo = ({ selectedBodyPart, prevStep, nextStep, setSpecificBodyPart, specificBodyPart, setSymptomDetails, symptomDetails}) => {

  const renderSwitch = (bodyPart) => {
    switch(bodyPart.toUpperCase()) {
      case 'KNEE':
        return <KneeImage setSpecificBodyPart={setSpecificBodyPart} specificBodyPart={specificBodyPart} />;
      case 'ELBOW':
        return <ElbowImage setSpecificBodyPart={setSpecificBodyPart} specificBodyPart={specificBodyPart} />;
      case 'BACK':
        return 'BACK IMG';
      default:
        return null;
    }
  }

  return (
    <>
      <div>{renderSwitch(selectedBodyPart)}</div>
      <Form.Group>
        <Form.Label>Please insert more details</Form.Label>
        <Form.Control as='textarea' value={symptomDetails} placeholder="Insert here details..." id='symptomDetails' onChange={(e) => { setSymptomDetails(e.target.value) }} />
      </Form.Group>

      <Button 
        // variant="warning"
        type="submit"
        className='form-button left-button'
        onClick={(e) => { e.preventDefault(); prevStep(); }}
      >
        Back
      </Button>

      <Button 
        id='addNewSymptomButton'
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

export default memo(StepTwo);