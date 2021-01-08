import React, { useState, useEffect } from 'react';
import { Form, FormControl, InputGroup, Button, Spinner } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import MultiSelect from "react-multi-select-component";
import { ToastContainer, toast } from 'react-toastify';


import toastConfig from '../../config/toast.config';
import functions from '../../config/firebase.functions';

import "react-datepicker/dist/react-datepicker.css";

const PhysioAccountPage = () => {

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [loading, setLoading] = useState(true);
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const options = [
    { label: "Shoulders", value: "Shoulders" },
    { label: "Knee", value: "Knee" },
    { label: "Back", value: "Back" },
    { label: "Elbow", value: "Elbow" },
  ];
  const [specialisations, setSpecialisations] = useState([]);

  useEffect(() => {
    const fetchData = async () => { 
      const data = await getPhysioData(userInfo.uid);
      setDateOfBirth(new Date(data.dob._seconds) * 1000)
      const specialisationsFormatted = data.specialisations.map(current => { return { label: current, value: current } })
      setSpecialisations(specialisationsFormatted)
      setLoading(false);
     }
 
     fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getPhysioData = async (userID) => {
    try {
      const getPhysioData = functions.httpsCallable('getPhysioData');
      const response = await getPhysioData({ physioID: userID  });
      console.log(userID)
      console.log(response.data)
      return response.data.physioData;
    } catch (err) {
      toast.error('😔 There was an error retrieving your account information!', toastConfig)
    }
  }

  const updateAccount = async (physioID) => {
    try {
      const newUsername = document.getElementById('username').value;
      const newDob = document.getElementById('dob').value;
      const newDobTimestamp = newDob.split("/").reverse().join("-");

      const specialisationsFormatted = specialisations.map((current) => { return current.value});

      const updatePhysioAccount = functions.httpsCallable('updatePhysioAccount');
      const response = await updatePhysioAccount({ physioID, name: newUsername, dob: newDobTimestamp, specialisations: specialisationsFormatted });
      
      toast.success(`🚀 ${response.data.message}`, toastConfig);

    } catch (err) {
      toast.error('😔 There was an error updating your account!', toastConfig)
    }
  }

  return (
    <>
      <h2 style={{ marginBottom: '1em' }}> Your Details </h2>

      <ToastContainer />
      { loading ? 
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner> 

      : <Form id="accountForm">
        <Form.Label> Username </Form.Label>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text><span role='img' aria-label='physio'>👨‍⚕️</span></InputGroup.Text>
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
        <Form.Label> Specialisations </Form.Label>
        {/* <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>List</InputGroup.Text>
          </InputGroup.Prepend> */}
        <MultiSelect
          id='specialisations'
          options={options}
          value={specialisations}
          onChange={setSpecialisations}
          labelledBy={"Select"}
          hasSelectAll={false}
          selectAllLabel={false}
        />
          {/* <Form.Control id="temp3" as="select" multiple htmlSize={3}>
            <option>Knee</option>
            <option>Shoulder</option>
            <option>Back</option>
            <option>Elbow</option>
            <option>Foot</option>
          </Form.Control> */}
        {/* </InputGroup> */}
          <Button variant='success' onClick={() => { updateAccount(userInfo.uid) }} style={{ marginRight: '1em' }}>Update</Button>
          <Button variant='danger' onClick={() => {console.log('clear')}}> Clear </Button>
      </Form>
    }
    </>
  );
}

export default PhysioAccountPage;