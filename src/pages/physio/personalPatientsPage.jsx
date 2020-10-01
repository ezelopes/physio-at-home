import React, { useState, useEffect } from 'react';
import firebase from '../../config/firebase.config';

import { Button, Card, Container, Row, Col } from 'react-bootstrap'

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

  return (
    <>
      <Container style={{ maxWidth: '100%' }}>
        <Row>
        { Object.keys(physioPatientsList).map((patientID) => {
            return <div id={patientID} key={patientID}>
              <Col lg={true} style={{ marginTop: '1.5em' }}>
                <Card style={{ width: '20em' }}>
                  <Card.Body>
                    <Card.Img variant="top" src={ physioPatientsList[patientID].photoURL } style={{ borderRadius: '50%' }} />
                    <Card.Title style={{ marginTop: '1em'}}> Name: { physioPatientsList[patientID].name } </Card.Title>
                    <Card.Text>
                      Email: { physioPatientsList[patientID].email }
                    </Card.Text>
                    <Button variant="primary">See Details</Button>
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