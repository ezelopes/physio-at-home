import React, { useState } from 'react';
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify';

import functions from '../../config/firebase.functions';
import toastConfig from '../../config/toast.config';

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

  const [loading, setLoading] = useState(false);

  const submitNewSymptom = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const rangeOfMotion = { minAngle, maxAngle };
      const bodyPart = { rightOrLeft, bodyPart: selectedBodyPart, specificBodyPart }
      
      const addNewPatientSymptom = functions.httpsCallable('addNewPatientSymptom');
      await addNewPatientSymptom({ patientID: userInfo.uid, symptomTitle, painRangeValue, bodyPart, symptomDetails, rangeOfMotion });
    
      toast.success('🚀 Symptom Added Successfully!', toastConfig);
    } catch(err) {
      toast.error('😔 There was an error adding your symptom!', toastConfig);
    } finally {
      setLoading(false);
    } 
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
        onClick={(e) => submitNewSymptom(e)}
        disabled={loading}
      >
        { loading ? 'Loading...' : 'Submit' }
      </Button>
    </>
  );
}

export default StepFour;