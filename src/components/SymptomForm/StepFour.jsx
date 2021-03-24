import React, { memo, useState } from 'react';
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify';

import firebase from '../../config/firebase.config';
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
      const rangeOfMotion = { minAngle: parseFloat(minAngle), maxAngle: parseFloat(maxAngle) };
      const bodyPart = { rightOrLeft, bodyPart: selectedBodyPart, specificBodyPart }

      if (!symptomTitle || !symptomDetails) return toast.error('⚠️ Missing required parameters!', toastConfig);
      
      console.log(rangeOfMotion)
      if (rangeOfMotion.minAngle > rangeOfMotion.maxAngle) 
        return toast.error('⚠️ Range of Motion is not valid. Either tick the checkbox or use Kinect!', toastConfig);
      
      const addNewPatientSymptom = firebase.functions.httpsCallable('addNewPatientSymptom');
      await addNewPatientSymptom({ patientID: userInfo.uid, symptomTitle, painRangeValue, bodyPart, symptomDetails, rangeOfMotion });
    
      toast.success('🚀 Symptom Added Successfully!', toastConfig);
      window.location.assign('/patient/yoursymptoms');
    } catch(err) {
      toast.error('⚠️ There was an error adding your symptom!', toastConfig);
    } finally {
      setLoading(false);
    } 
  }

  return (
    <>
      <p> <b>Title:</b> { symptomTitle } </p>
      <p> <b>Pain Value: </b> { painRangeValue } </p>
      <p> <b>Details: </b> { symptomDetails } </p>
      <p> <b>Right/Left: </b> { rightOrLeft } </p>
      <p> <b>Body Part: </b> { selectedBodyPart } </p>
      <p> <b>Specific Body Part: </b> { specificBodyPart.map((item, index) => { return <> {index === 0 ? '' : '-'} {item} </>}) } </p>
      <p> <b>Range of Motion: </b> { minAngle }° to { maxAngle }° </p>

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

export default memo(StepFour);