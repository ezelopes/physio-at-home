import React, { memo, useState, useEffect } from 'react';
import { Form, FormControl, Container, Spinner } from 'react-bootstrap';
import MultiSelect from "react-multi-select-component";
import { ToastContainer, toast } from 'react-toastify';

import TherapistsDisplayer from '../../components/therapistsDisplayer'

import firebase from '../../config/firebase.config';
import toastConfig from '../../config/toast.config';
import 'react-toastify/dist/ReactToastify.css';

const SearchPhysiotherapistsPage = () => {

  const options = [
    { label: "Shoulders", value: "Shoulders" },
    { label: "Knee", value: "Knee" },
    { label: "Back", value: "Back" },
    { label: "Elbow", value: "Elbow" },
  ];

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [loading, setLoading] = useState(true);

  const [physiotherapistsList, setPhysiotherapistsList] = useState([]);
  const [patientRequestsList, setPatientRequestsList] = useState([]);
  const [myPhysiotherapistList, setMyPhysiotherapistList] = useState([]);

  const [specialisationsFilter, setSpecialisationsFilter] = useState([]);
  const [therapistNameFilter, setTherapistNameFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => { 
     const patientData = await getPatientData(userInfo.uid);
     if (patientData){
       setPatientRequestsList(patientData.requestsList);
       setMyPhysiotherapistList(patientData.physiotherapistsList);
     }
     const responsePhysio = await getPhysiotherapistsList(); 
     if (responsePhysio) setPhysiotherapistsList(responsePhysio);
     setLoading(false);
    }

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPhysiotherapistsList = async () => {
    try {
      const getAllPhysiotherapists = firebase.functions.httpsCallable('getAllPhysiotherapists');
      const response = await getAllPhysiotherapists();

      return response.data.physiotherapists;
    } catch (err) {
      toast.error('😔 An error occured while retrieving the information!', toastConfig);
    }
  }

  const getPatientData = async (userID) => {
    try {
      const getPatientData = firebase.functions.httpsCallable('getPatientData');
      const response = await getPatientData({ patientID: userID });

      return response.data.patientData;
    } catch (err) {
      toast.error('😔 An error occured while retrieving the information!', toastConfig);
    }
  }

  const handleFunctionCall = async (buttonRef, firebaseFunction, objParameter, btnTextAfter) => {
    buttonRef.disabled = true;
    buttonRef.textContent = 'Loading...';
    buttonRef.className = 'btn btn-primary';

    await firebaseFunction(objParameter);

    return buttonRef.textContent = btnTextAfter;
  }

  const sendInvite = async (e, physioID) => {
    const sendInviteBTN = e.target;
    try {
      const sendInvite = firebase.functions.httpsCallable('sendInvite');
      const inviteObj = { physioID, patientID: userInfo.uid, patientEmail: userInfo.email, patientName: userInfo.name, photoURL: userInfo.photoURL };

      await handleFunctionCall(sendInviteBTN, sendInvite, inviteObj, 'Invite Sent!');

      toast.success('🚀 Invite Sent Successfully!', toastConfig);
    } catch (err) {
      toast.error('😔 There was an error sending your invite!', toastConfig);
      sendInviteBTN.className = 'btn btn-warning';
      sendInviteBTN.textContent = 'Refresh Page!';
    }
  }

  const removeConnection = async (e, physioID) => {
    const removeConnectionBTN = e.target;
    try {
      const removeConnection = firebase.functions.httpsCallable('removeConnection');
      const removeObj = { physioID, patientID: userInfo.uid } 

      await handleFunctionCall(removeConnectionBTN, removeConnection, removeObj, 'Connection Removed!');

      toast.success('🚀 Connection Removed Successfully!', toastConfig);
    } catch (err) {
      toast.error('😔 There was an error removing this connection!', toastConfig);
      removeConnectionBTN.className = 'btn btn-warning';
      removeConnectionBTN.textContent = 'Refresh Page!';
    }
  }

  return (
    <>
      <ToastContainer />

      <Form id="searchForm" className="first-element">
          <FormControl 
            id='searchTherapistName'
            placeholder='Therapist Name'
            value={therapistNameFilter}
            onChange={e => setTherapistNameFilter(e.target.value)}
          />

        <MultiSelect
          id='specialisations'
          className='first-element'
          options={options}
          value={specialisationsFilter}
          onChange={setSpecialisationsFilter}
          labelledBy={"Select Specialisation"}
          hasSelectAll={false}
          selectAllLabel={false}
        />
      </Form>

      { loading
        ? <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner> 
        : <Container>
            <TherapistsDisplayer 
              physiotherapistsList={physiotherapistsList} 
              patientRequestsList={patientRequestsList}
              myPhysiotherapistList={myPhysiotherapistList}
              sendInvite={sendInvite}
              removeConnection={removeConnection}
              therapistNameFilter={therapistNameFilter}
              specialisationsFilter={specialisationsFilter}
            />
          </Container>
      }
    </>
  );
}

export default memo(SearchPhysiotherapistsPage);