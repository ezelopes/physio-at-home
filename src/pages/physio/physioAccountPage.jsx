import React, { memo, useState, useEffect } from 'react';
import { Form, FormControl, InputGroup, Button, Spinner } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import MultiSelect from "react-multi-select-component";
import { ToastContainer, toast } from 'react-toastify';


import toastConfig from '../../config/toast.config';
import firebase from '../../config/firebase.config';

import "react-datepicker/dist/react-datepicker.css";

const userInfo = JSON.parse(localStorage.getItem('userInfo'));
let initialDob;
let initialSpecialisation;

const PhysioAccountPage = () => {

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(userInfo.name);
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
      initialDob = new Date(data.dob._seconds) * 1000;
      const specialisationsFormatted = data.specialisations.map(current => { return { label: current, value: current } });
      setSpecialisations(specialisationsFormatted);
      initialSpecialisation = specialisationsFormatted;
      setLoading(false);
     }
 
     fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getPhysioData = async (userID) => {
    try {
      const getPhysioData = firebase.functions.httpsCallable('getPhysioData');
      const response = await getPhysioData({ physioID: userID  });

      return response.data.physioData;
    } catch (err) {
      toast.error('😔 There was an error retrieving your account information!', toastConfig)
    }
  }

  const updateAccount = async (physioID) => {
    try {
      const specialisationsFormatted = specialisations.map((current) => { return current.value});

      const updatePhysioAccount = firebase.functions.httpsCallable('updatePhysioAccount');
      const response = await updatePhysioAccount({ physioID, name: username, dob: convertDate(dateOfBirth), specialisations: specialisationsFormatted });
      
      toast.success(`🚀 ${response.data.message}`, toastConfig);

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
    setUsername(userInfo.name);
    setDateOfBirth(initialDob);
    setSpecialisations(initialSpecialisation);
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
              <InputGroup.Text><span role='img' aria-label='physio'>👨‍⚕️</span></InputGroup.Text>
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

          <Form.Label> Specialisations </Form.Label>
          <MultiSelect
            id='specialisations'
            options={options}
            value={specialisations}
            onChange={setSpecialisations}
            labelledBy={"Select"}
            hasSelectAll={false}
            selectAllLabel={false}
          />

          <Button variant='success' onClick={() => { updateAccount(userInfo.uid) }} className='left-button'>Update</Button>
          <Button variant='danger' onClick={() => { clearChanges() }}> <span role='img' aria-label='bin'>🗑️</span> Clear </Button>
        </Form>
    }
    </>
  );
}

export default memo(PhysioAccountPage);