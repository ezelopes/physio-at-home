import React, { memo, useEffect, useState } from 'react';
import { Form, FormControl, InputGroup, Button, Spinner } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import { ToastContainer, toast } from 'react-toastify';

import toastConfig from '../../config/toast.config';
import functions from '../../config/firebase.functions';

import "react-datepicker/dist/react-datepicker.css";

const userInfo = JSON.parse(localStorage.getItem('userInfo'));
let initialDob;

const PatientAccountPage = () => {

  const [loading, setLoading] = useState(true);
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [username, setUsername] = useState(userInfo.name);
  const [btnDisabled, setBtnDisabled] = useState(false);

  useEffect(() => {
    const fetchData = async () => { 
      const data = await getPatientData(userInfo.uid);
      setDateOfBirth(new Date(data.dob._seconds) * 1000)
      initialDob = new Date(data.dob._seconds) * 1000;
      setLoading(false);
     }
 
     fetchData();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getPatientData = async (userID) => {
    try {
      const getPatientData = functions.httpsCallable('getPatientData');
      const response = await getPatientData({ patientID: userID });

      return response.data.patientData;
    } catch (err) {
      toast.error('😔 There was an error while retrieving your data!', toastConfig)
    }
  }


  const updateAccount = async (patientID) => {
    try {      
      setBtnDisabled(true);

      const updatePatientAccount = functions.httpsCallable('updatePatientAccount');
      const response = await updatePatientAccount({ patientID, name: username, dob: convertDate(dateOfBirth) });

      toast.success(`🚀 ${response.data.message}`, toastConfig);
      setBtnDisabled(false);

    } catch (err) {
      toast.error('😔 There was an error updating your account!', toastConfig)
    }
  }

  const convertDate = (inputFormat) => {
    const pad = (s) => { return (s < 10) ? '0' + s : s; }

    const d = new Date(inputFormat)
    return [d.getFullYear(), pad(d.getMonth()+1), pad(d.getDate())].join('-')
  }

  const clearChanges = () => {
    setDateOfBirth(initialDob);
    setUsername(userInfo.name);
  }

  return (
    <>
      <ToastContainer />

      { loading ? 
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner> 

      : <Form id="accountForm">
          <h2><Form.Text> Your Details </Form.Text></h2>
          <Form.Label> Username </Form.Label>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text><span role='img' aria-label='patient'>🙋‍♂️</span></InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl id="username" placeholder="Name" value={username} disabled onChange={e => setUsername(e.target.value)} />
          </InputGroup>
          <Form.Label> Date of Birth </Form.Label>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text><span role='img' aria-label='calendar'>📅</span></InputGroup.Text>
            </InputGroup.Prepend>
            <DatePicker id="dob" className="form-control" selected={dateOfBirth} onChange={date => setDateOfBirth(date)} dateFormat='dd/MM/yyyy' />
          </InputGroup>
        
          <Button variant='success' onClick={() => { updateAccount(userInfo.uid) }} className='left-button' disabled={btnDisabled}>Update</Button>
          <Button variant='danger' onClick={() => { clearChanges() }}> <span role='img' aria-label='bin'>🗑️</span> Clear </Button>
        </Form>
      }
    </>
  );
}

export default memo(PatientAccountPage);