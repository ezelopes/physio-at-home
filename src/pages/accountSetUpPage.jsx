import React, { memo, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { Form, FormControl, InputGroup, Button, Spinner } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import MultiSelect from "react-multi-select-component";
import { ToastContainer, toast } from 'react-toastify';

import toastConfig from '../config/toast.config';
import firebase from '../config/firebase.config';

const options = [
  { label: "Shoulders", value: "Shoulders" },
  { label: "Knee", value: "Knee" },
  { label: "Back", value: "Back" },
  { label: "Elbow", value: "Elbow" },
];

const userInfo = JSON.parse(localStorage.getItem('userInfo'));
let initialDob;
let initialSpecialisation;
let initialHeight;
let initialWeight;

const AccountSetUpPage = ({ role, activated }) => {
  
  const currentUserRole = role;

  const [loading, setLoading] = useState(true);
  const [specialisations, setSpecialisations] = useState([]);
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [username, setUsername] = useState(userInfo.name);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(60);
  const [btnDisabled, setBtnDisabled] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => { 
      let data;

      if (currentUserRole === 'PATIENT') {
        data = await getPatientData(userInfo.uid);
      } else if (currentUserRole === 'PHYSIOTHERAPIST') {
        data = await getPhysioData(userInfo.uid);
        const specialisationsFormatted = data.specialisations.map(current => { return { label: current, value: current } });
        setSpecialisations(specialisationsFormatted);
        initialSpecialisation = specialisationsFormatted;
      }

      setHeight(data.height);
      setWeight(data.weight);
      setDateOfBirth(new Date(data.dob._seconds) * 1000)
      initialDob = new Date(data.dob._seconds) * 1000;
      initialHeight = data.height;
      initialWeight = data.weight;
      
      setLoading(false);
     }
 
     fetchData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  if (!currentUserRole) return (<Redirect to={{ pathname: '/' }} />)
  
  const getPatientData = async (userID) => {
    try {
      const getPatientData = firebase.functions.httpsCallable('getPatientData');
      const response = await getPatientData({ patientID: userID });

      return response.data.patientData;
    } catch (err) {
      toast.error('😔 There was an error while retrieving your data!', toastConfig)
    }
  }

  const getPhysioData = async (userID) => {
    try {
      const getPhysioData = firebase.functions.httpsCallable('getPhysioData');
      const response = await getPhysioData({ physioID: userID  });

      return response.data.physioData;
    } catch (err) {
      toast.error('😔 There was an error retrieving your account information!', toastConfig)
    }
  }

  const updateAccount = async (userID) => {
    try {      
      setBtnDisabled(true);
      let response;

      if (currentUserRole === 'PATIENT') {
        const updatePatientAccount = firebase.functions.httpsCallable('updatePatientAccount');
        response = await updatePatientAccount({ patientID: userID, name: username, dob: convertDate(dateOfBirth), height, weight });
      } else if (currentUserRole === 'PHYSIOTHERAPIST') {
        const specialisationsFormatted = specialisations.map((current) => { return current.value});

        const updatePhysioAccount = firebase.functions.httpsCallable('updatePhysioAccount');
        response = await updatePhysioAccount({ physioID: userID, name: username, dob: convertDate(dateOfBirth), height, weight, specialisations: specialisationsFormatted, });
      }

      toast.success(`🚀 ${response.data.message}`, toastConfig);

    } catch (err) {
      toast.error('😔 There was an error updating your account!', toastConfig)
    } finally { setBtnDisabled(false); }
  }

  const convertDate = (inputFormat) => {
    const pad = (s) => { return (s < 10) ? '0' + s : s; }

    const d = new Date(inputFormat)
    return [d.getFullYear(), pad(d.getMonth()+1), pad(d.getDate())].join('-')
  }

  const clearChanges = () => {
    setDateOfBirth(initialDob);
    setUsername(userInfo.name);
    setHeight(initialHeight);
    setWeight(initialWeight);
    setSpecialisations(initialSpecialisation);
  }

  return (
    <>
      <ToastContainer />
      { activated ? <></> : <h2> Set Up your account before you can continue! </h2>}
      
      {
        loading 
        ? 
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner> 
        :
          <Form id="accountForm" className='first-element'>
            <h2><Form.Text> Your Details </Form.Text></h2>
            <Form.Label> Username </Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text><span role='img' aria-label='patient'>🙋‍♂️</span></InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl id="username" placeholder="Name" value={username} onChange={e => setUsername(e.target.value)} />
            </InputGroup>

            <Form.Label> Height (in cm) </Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text><span role='img' aria-label='ruler'>📏</span></InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl id="height" placeholder="170" value={height} onChange={e => setHeight(e.target.value)} />
            </InputGroup>

            <Form.Label> Weight (in kg) </Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text><span role='img' aria-label='scale'>⚖️</span></InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl id="weight" placeholder="60" value={weight} onChange={e => setWeight(e.target.value)} />
            </InputGroup>

            { currentUserRole === 'PHYSIOTHERAPIST' 
              ?
              <>
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
              </>
              : <></>
            }

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

export default memo(AccountSetUpPage);