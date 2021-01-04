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
  rightOrLeft,
  specificBodyPart,
  minAngle,
  maxAngle,
}) => {

  const submitNewSymptom = async (e) => {
    e.preventDefault();

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    document.getElementById('addNewSymptomButton').disabled = true;
    document.getElementById('addNewSymptomButton').textContent = 'Loading...';
    try {
      // round min and max angles
      const rangeOfMotion = { minAngle, maxAngle };
      const bodyPart = { rightOrLeft, bodyPart: selectedBodyPart, specificBodyPart }
      console.log(symptomTitle, painRangeValue, symptomDetails, rangeOfMotion, bodyPart)
      
      const addNewPatientSymptom = functions.httpsCallable('addNewPatientSymptom');
      const response = await addNewPatientSymptom({ patientID: userInfo.uid, symptomTitle, painRangeValue, bodyPart, symptomDetails, rangeOfMotion });
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
      <p> Right/Left: { rightOrLeft } </p>
      <p> Body Part: { selectedBodyPart } </p>
      <p> Specific Body Part: { specificBodyPart } </p>
      <p> Range of Motion: { minAngle } - { maxAngle } </p>

      <Button 
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