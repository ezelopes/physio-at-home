import React, { useEffect, useState } from 'react';
import { Form, FormControl, InputGroup, Button, Spinner } from 'react-bootstrap';
import DatePicker from "react-datepicker";

import functions from '../../config/firebase.functions';

import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";

const PatientAccountPage = () => {

  // GET DOB ON LOG IN AND STORE IT INTO. PHYSIO -> PATIENT -> Name is not updating though...

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [loading, setLoading] = useState(true);
  const [dateOfBirth, setDateOfBirth] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => { 
      const data = await getPatientData(userInfo.uid);
      setDateOfBirth(new Date(data.dob._seconds) * 1000)
      setLoading(false);
     }
 
     fetchData();
  }, [])

  const getPatientData = async (userID) => {
    try {
      const getPatientData = functions.httpsCallable('getPatientData');
      const response = await getPatientData({ patientID: userID });

      return response.data.patientData;
    } catch (err) {
      console.log(err);
    }
  }


  const updateAccount = async (patientID) => {
    try {
      const newUsername = document.getElementById('username').value;
      const newDob = document.getElementById('dob').value;
      // height and weight?
      
      const newDobTimestamp = newDob.split("/").reverse().join("-");

      // const user = firebase.auth().currentUser;

      // await user.updateProfile({
      //   displayName: newUsername,
      // })

      const updatePatientAccount = functions.httpsCallable('updatePatientAccount');
      const response = await updatePatientAccount({ patientID, name: newUsername, dob: newDobTimestamp });
      
      alert(response.data.message)

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <h2 style={{ marginBottom: '1em' }}> Your Details </h2>

      { loading ? 
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner> 

      : <Form id="accountForm">
        <Form.Label> Username </Form.Label>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text><span role='img' aria-label='patient'>🙋‍♂️</span></InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl id="username" placeholder="Name" defaultValue={userInfo.name} disabled />
        </InputGroup>
        <Form.Label> Date of Birth </Form.Label>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text><span role='img' aria-label='calendar'>📅</span></InputGroup.Text>
          </InputGroup.Prepend>
          <DatePicker id="dob" className="form-control" selected={dateOfBirth} onChange={date => setDateOfBirth(date)} dateFormat='dd/MM/yyyy' />
        </InputGroup>
      
        <Button variant='success' onClick={() => { updateAccount(userInfo.uid) }} style={{ marginRight: '1em' }}>Update</Button>
        <Button variant='danger' onClick={() => { console.log('clear') }}> Clear </Button>
      </Form>
      }
    </>
  );
}

export default PatientAccountPage;