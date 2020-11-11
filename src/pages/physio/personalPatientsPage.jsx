import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Container, Row, Col } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';

import firebase from '../../config/firebase.config';
import toastConfig from '../../config/toast.config';
import 'react-toastify/dist/ReactToastify.css';

const functions = firebase.functions();

if (process.env.NODE_ENV === 'development') functions.useFunctionsEmulator("http://localhost:5001");

const PersonalPatientsPage = () => {
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [physioPatientsList, setPhysioPatientsList] = useState([]);


  useEffect(() => {
    const fetchData = async () => { 
      const response = await getAllPhysioPatients(userInfo.uid);
      setPhysioPatientsList(response.patientsList);
     }
 
     fetchData();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getAllPhysioPatients = async (userID) => {
    try {
      const getAllPhysioPatients = functions.httpsCallable('getAllPhysioPatients');
      const response = await getAllPhysioPatients({ physioID: userID });
      const { patientsList } = response.data;
      console.log(patientsList)

      return { patientsList };
    } catch (err) {
      console.log(err);
    }
  }

  const removeConnection = async (patientID) => {
    try {
      const physioID = userInfo.uid;
      document.getElementById(`${patientID}-removeConnectionButton`).disabled = true;
      document.getElementById(`${patientID}-removeConnectionButton`).textContent = 'Loading...';
      document.getElementById(`${patientID}-removeConnectionButton`).className = 'btn btn-primary';
      
      const removeConnection = functions.httpsCallable('removeConnection');
      const response = await removeConnection({ 
        physioID, patientID,
      });
      console.log(response);

      document.getElementById(`${patientID}-removeConnectionButton`).textContent = 'Connection Removed!';
      toast.success('🚀 Connection Removed Successfully!', toastConfig);
    } catch (err) {
      toast.error('😔 There was an error removing this connection!', toastConfig);
      document.getElementById(`${patientID}-removeConnectionButton`).className = 'btn btn-warning';
      document.getElementById(`${patientID}-removeConnectionButton`).textContent = 'Refresh Page!';
      console.log(err);
    }
  }

  return (
    <>
      <ToastContainer />
      <Container>
        <Row>
        { Object.keys(physioPatientsList).map((patientID) => {
            return <div id={patientID} key={patientID}>
              <Col lg={true}>
                <Card>
                  <Card.Body>
                    <Card.Img variant="top" src={ physioPatientsList[patientID].photoURL } style={{ borderRadius: '50%' }} />
                    <Card.Title style={{ marginTop: '1em'}}> Name: { physioPatientsList[patientID].name } </Card.Title>
                    <Card.Text>
                      Email: { physioPatientsList[patientID].email }
                    </Card.Text>
                    <Link to={{ pathname: `/physio/selectedPatient`, state: { patientID, name: physioPatientsList[patientID].name } }}>
                      <Button variant="primary" style={{ marginRight: '1em' }}> See Details </Button>
                    </Link>
                    <Button 
                      id={`${patientID}-removeConnectionButton`}
                      variant="danger"
                      onClick={() => { removeConnection(patientID) }}
                    >
                      Remove Patient
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </div>
          }) 
        }
        </Row>
      </Container>
    </>
  );
}

export default PersonalPatientsPage;