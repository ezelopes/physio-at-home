import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';

import firebase from '../../config/firebase.config';
import toastConfig from '../../config/toast.config';
import 'react-toastify/dist/ReactToastify.css';

import RangeBar from '../../components/rangeBar'
import KneeImage from '../../components/kneeImage'

const functions = firebase.functions();

const AddNewSymptomPage = () => {

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const bodyPartsList = [ 'Knee', 'Shoulder', 'Back' ];

  const [selectedBodyPart, setBodyPart] = useState('Knee');
  const [specificBodyPart, setSpecificBodyPart] = useState('');

  const submitNewSymptom = async (e) => {
    e.preventDefault();

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

  const handleBodyPartChange = (e) => {
    const { value } = e.target;
    setBodyPart(value);
  }

  const renderSwitch = (bodyPart) => {
    switch(bodyPart.toUpperCase()) {
      case 'KNEE':
        return <KneeImage setSpecificBodyPart={setSpecificBodyPart} />;
      case 'SHOULDER':
        return 'SHOULDER IMG';
      case 'BACK':
        return 'BACK IMG';
      default:
        return null;
    }
  }
  return (
    <>
      <ToastContainer />
      <h2 style={{ marginBottom: '1em' }}> Add New Symptoms Here </h2>
      <Form style={{ width: '60%', margin: 'auto', border: 'solid', padding: '2em' }}>
      <Form.Group>
          <Form.Label>Symptom Title</Form.Label>
          <Form.Control as='text' placeholder="Insert here a title..." id='symptomTitle' />
        </Form.Group>

        <Form.Group style={{ marginTop: '2em' }}>
          <Form.Label> Where do you feel pain? </Form.Label>
          <Form.Control
            placeholder='Choose...'
            as="select"
            className="my-1 mr-sm-2"
            id="bodyPartSelect"
            onChange={(e) => { handleBodyPartChange(e) }}
            custom
          >
            {bodyPartsList.map((currentBodyPart, index) => {
              return <option value={currentBodyPart} key={index}> {currentBodyPart} </option>
            })}
          </Form.Control>
          {/* IMG WITH BUTTONS - DEFAULT VISIBLE FALSE. CHANGE SRC BASED ON SELECTION */}
        </Form.Group>
          <div>{renderSwitch(selectedBodyPart)}</div>
          
        {/* <BodyImageComponent bodyPart={selectedBodyPart} /> */}

        <Form.Group style={{ marginTop: '2em' }}>
          <Form.Label>How much pain do you feel?</Form.Label>
          <RangeBar id="painRangeID" />
        </Form.Group>

        <Form.Group style={{ marginTop: '2em' }}>
          <Form.Label>Please insert more details</Form.Label>
          <Form.Control as='textarea' placeholder="Insert here details..." id='symptomDetails' />
        </Form.Group>

        <Form.Group style={{ marginTop: '2em' }}>
          <Button variant="primary" type="button" style={{ marginRight: '1em' }}>
            Record Video
          </Button>
          <Button variant="primary" type="button">
            Upload Video
          </Button>
        </Form.Group>

        <Button 
          id='addNewSymptomButton'
          variant="success"
          type="submit"
          style={{ marginTop: '2em' }}
          onClick={(e) => submitNewSymptom(e)}
        >
          Submit
        </Button>
      </Form>
    </>
  );
}

export default AddNewSymptomPage;