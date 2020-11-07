import React from 'react';
import { Button, Form } from 'react-bootstrap'
import KneeImage from '../kneeImage'

const StepTwo = ({ selectedBodyPart, prevStep, nextStep, setSpecificBodyPart, specificBodyPart, setSymptomDetails, symptomDetails}) => {

  const renderSwitch = (bodyPart) => {
    switch(bodyPart.toUpperCase()) {
      case 'KNEE':
        return <KneeImage setSpecificBodyPart={setSpecificBodyPart} specificBodyPart={specificBodyPart} />;
      case 'ELBOW':
        return 'ELBOW IMG';
      case 'BACK':
        return 'BACK IMG';
      default:
        return null;
    }
  }

  return (
    <>
      <div>{renderSwitch(selectedBodyPart)}</div>
      <Form.Group style={{ marginTop: '2em' }}>
        <Form.Label>Please insert more details</Form.Label>
        <Form.Control as='textarea' value={symptomDetails} placeholder="Insert here details..." id='symptomDetails' onChange={(e) => { setSymptomDetails(e.target.value) }} />
      </Form.Group>

      <Button 
        id='addNewSymptomButton'
        // variant="warning"
        type="submit"
        style={{ marginTop: '2em', marginRight: '1em' }}
        onClick={(e) => { e.preventDefault(); prevStep(); }}
      >
        Back
      </Button>

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

export default StepTwo;