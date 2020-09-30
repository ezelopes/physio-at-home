import React, { useState, useEffect } from 'react';
import firebase from '../../config/firebase.config';

import { Container, Row, Col, Table, Button } from 'react-bootstrap'

const functions = firebase.functions();

if (process.env.NODE_ENV === 'development') functions.useFunctionsEmulator("http://localhost:5001");

const ProfilePage = () => {

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [physioPatientsList, setPhysioPatientsList] = useState([]);
  const [physioPendingPatientsList, setPhysioPendingPatientsList] = useState([]);

  useEffect(() => {
    const fetchData = async () => { 
      const response = await getAllPhysioPatients(userInfo.uid);
      setPhysioPatientsList(response.patientsList);
      setPhysioPendingPatientsList(response.pendingPatientsList);
     }
 
     fetchData();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getAllPhysioPatients = async (userID) => {
    try {
      const getAllPhysioPatients = functions.httpsCallable('getAllPhysioPatients');
      const response = await getAllPhysioPatients({ physioID: userID });
      const { patientsList, pendingPatientsList } = response.data;

      return { patientsList, pendingPatientsList };
    } catch (err) {
      console.log(err);
    }
  }

  const acceptRequest = async (patientId) => {
    console.log(`accepted ${patientId}`);
    const updatedPendingPatientsList = physioPendingPatientsList.filter((currentPatient) => {
      return currentPatient.id !== patientId;
    });
    setPhysioPendingPatientsList(updatedPendingPatientsList)
  }
  const declineRequest = async (patientId) => {
    console.log(`accepted ${patientId}`);
  }
  const seePatientDetails = async (patientId) => {
    console.log(`seePatientDetails ${patientId}`);
  }

  return (
    <>
      <Container style={{ maxWidth: '100%' }}>
        <Row>
          <Col>
          <h4> YOUR PATIENTS </h4>
            <Table responsive>
              <thead>
                <tr>
                  {Array.from(['Name', 'Email', 'See Details']).map((element, index) => (
                    <th key={index}>{element}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from(physioPatientsList).map((patient, index) => (
                  <tr key={index}>
                    <td key='name'>{patient.name}</td>
                    <td key='email'>{patient.email}</td>
                    <td key='seeDetails'>
                      <Button onClick={() => { seePatientDetails(patient.id) }}>
                        See Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>  
          </Col>
          <div style={{ borderLeft: '0.2em solid grey', height: '50em' }}> </div>
          <Col>
            <h4> PENDING REQUESTS </h4>
            <Table responsive>
              <thead>
                <tr>
                  {Array.from(['Name', 'Email', 'Accept Request', 'Decline Request']).map((element, index) => (
                    <th key={index}>{element}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from(physioPendingPatientsList).map((pendingPatient, index) => (
                  <tr key={index}>
                    <td key='name'>{pendingPatient.name}</td>
                    <td key='email'>{pendingPatient.email}</td>
                    <td key='acceptRequest'>
                      <Button variant="success" onClick={() => { acceptRequest(pendingPatient.id) }}>
                        Accept Request
                      </Button>
                    </td>
                    <td key='declineRequest'>
                      <Button variant="danger" onClick={() => { declineRequest(pendingPatient.id) }}>
                        Decline Request
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>  
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ProfilePage;