import React, { memo } from 'react';
import { Button, Form } from 'react-bootstrap'
import KneeImage from '../BodyExtremities/kneeImage'
import ElbowImage from '../BodyExtremities/elbowImage'

import IconWithMessage from '../iconWithMessage'

const StepTwo = ({ selectedBodyPart, prevStep, nextStep, setSpecificBodyPart, specificBodyPart, setSymptomDetails, symptomDetails}) => {

  const toolTipMessage = {
    Details: 'REQUIRED: Give a more in depth explanation about your symptom'
  }

  const renderSwitch = (bodyPart) => {
    switch(bodyPart.toUpperCase()) {
      case 'KNEE':
        return <KneeImage setSpecificBodyPart={setSpecificBodyPart} specificBodyPart={specificBodyPart} />;
      case 'ELBOW':
        return <ElbowImage setSpecificBodyPart={setSpecificBodyPart} specificBodyPart={specificBodyPart} />;
      default:
        return null;
    }
  }

  return (
    <>
      <h2 className='first-element' style={{ marginBottom: '1em'}}> Indicate where you feel pain by clicking on the red dots below </h2>
      <div>{renderSwitch(selectedBodyPart)}</div>
      <Form.Group>
        <Form.Label>Please insert more details <b style={{color: 'red'}}>*</b> <IconWithMessage message={toolTipMessage.Details} /> </Form.Label>
        <Form.Control as='textarea' value={symptomDetails} placeholder="Insert here details..." id='symptomDetails' onChange={(e) => { setSymptomDetails(e.target.value) }} />
      </Form.Group>

      <Button 
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