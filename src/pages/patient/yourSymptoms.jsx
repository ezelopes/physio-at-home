import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap'

import firebase from '../../config/firebase.config';
import 'react-toastify/dist/ReactToastify.css';

const functions = firebase.functions();

if (process.env.NODE_ENV === 'development') functions.useFunctionsEmulator("http://localhost:5001");

const YourSymptoms = () => {
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [symptomsList, setSymptoms] = useState({});


  useEffect(() => {
    const fetchData = async () => { 
      const response = await getAllSymptoms(userInfo.uid);
      setSymptoms(response.symptomList);
     }
 
     fetchData();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getAllSymptoms = async (patientID) => {
    try {
      const getAllSymptomsFromPatient = functions.httpsCallable('getAllSymptomsFromPatient');
      const response = await getAllSymptomsFromPatient({ patientID });
      const { symptomList } = response.data;
      console.log(symptomList)

      return { symptomList };
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Container>
        <Row>
          { Object.keys(symptomsList).map((currentSymptomID) => {
                return <div id={currentSymptomID} key={currentSymptomID}>
                  <Col lg={true}>
                    <Card>
                      <Card.Body>
                        <Card.Title>
                          { symptomsList[currentSymptomID].symptomTitle }
                        </Card.Title>
                        <Card.Text>
                          Body Part: { symptomsList[currentSymptomID].specificBodyPart }
                        </Card.Text>
                        <Card.Text>
                          Pain Range Value: { symptomsList[currentSymptomID].painRangeValue }
                        </Card.Text>
                        <Card.Text>
                          Details: { symptomsList[currentSymptomID].symptomDetails }
                        </Card.Text>
                        <Button 
                          id={`${currentSymptomID}`}
                          variant="success"
                          onClick={() => { console.log(currentSymptomID) }}
                        >
                          Read Feedbacks!
                          {/* OPEN MODAL */}
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

export default YourSymptoms;