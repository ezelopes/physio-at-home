import React from 'react';
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify';

import firebase from '../../config/firebase.config';
import toastConfig from '../../config/toast.config';

const functions = firebase.functions();

const StepFour = ({ 
  prevStep,
  symptomTitle,
  painRangeValue,
  symptomDetails,
  selectedBodyPart,
  specificBodyPart,
  minRightAngle,
  maxRightAngle,
  minLeftAngle,
  maxLeftAngle
}) => {

  const submitNewSymptom = async (e) => {
    e.preventDefault();
  
    console.log({ symptomTitle, painRangeValue, symptomDetails, selectedBodyPart, specificBodyPart });
  
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    document.getElementById('addNewSymptomButton').disabled = true;
    document.getElementById('addNewSymptomButton').textContent = 'Loading...';
    try {
      const symptomTitle = document.getElementById('symptomTitle').value;
      const painRangeValue = document.getElementById('painRangeID').value;
      const symptomDetails = document.getElementById('symptomDetails').value;
      console.log(painRangeValue, specificBodyPart, symptomDetails)
    
      const addNewPatientSymptom = functions.httpsCallable('addNewPatientSymptom');
      const response = await addNewPatientSymptom({ patientID: userInfo.uid, symptomTitle, painRangeValue, specificBodyPart, symptomDetails });
      console.log(response);
    
      toast.success('🚀 Symptom Added Successfully!', toastConfig);
    } catch(err) {
      toast.error('😔 There was an error adding your symptom!', toastConfig);
    }
      
    document.getElementById('addNewSymptomButton').disabled = false;
    document.getElementById('addNewSymptomButton').textContent = 'Submit';
  }

  return (
    <>
      <p> Title: { symptomTitle } </p>
      <p> Pain Value: { painRangeValue } </p>
      <p> Details: { symptomDetails } </p>
      <p> Body Part: { selectedBodyPart } </p>

      <p> Min Right Angle: { minRightAngle } </p>
      <p> Max Right Angle: { maxRightAngle } </p>
      <p> Min Left Angle: { minLeftAngle } </p>
      <p> Max Left Angle: { maxLeftAngle } </p>

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
          onClick={(e) => submitNewSymptom(e)}
        >
          Submit
        </Button>
    </>
  );
}

export default StepFour;