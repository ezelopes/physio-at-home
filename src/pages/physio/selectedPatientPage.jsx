import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap'

import firebase from '../../config/firebase.config';
import 'react-toastify/dist/ReactToastify.css';

const functions = firebase.functions();

const SelectedPatientPage = (props) => {

  const { patientID, name } = props.location.state;
  const [patientSymptomsList, setPatientSymptoms] = useState({});

  useEffect(() => {
    const fetchData = async () => { 
      const response = await getAllPatientSymptoms(patientID);
      setPatientSymptoms(response.symptomList);
     }
 
     fetchData();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getAllPatientSymptoms = async (patientID) => {
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
      <Button onClick={() => props.history.goBack() } style={{ marginRight: '90%'}} > <span role="img" aria-label="back"> ⬅️ </span> GO BACK </Button> 
      <h2> List of Symptoms of {name} </h2>
      <Container>
        <Row>
          { Object.keys(patientSymptomsList).map((currentSymptomID) => {
                return <div id={currentSymptomID} key={currentSymptomID}>
                  <Col lg={true}>
                    <Card>
                      <Card.Body>
                        <Card.Title>
                          { patientSymptomsList[currentSymptomID].symptomTitle }
                        </Card.Title>
                        <Card.Text>
                          Body Part: { patientSymptomsList[currentSymptomID].specificBodyPart }
                        </Card.Text>
                        <Card.Text>
                          Pain Range Value: { patientSymptomsList[currentSymptomID].painRangeValue }
                        </Card.Text>
                        <Card.Text>
                          Details: { patientSymptomsList[currentSymptomID].symptomDetails }
                        </Card.Text>
                        <Button 
                          id={`${currentSymptomID}`}
                          variant="success"
                          onClick={() => { console.log(currentSymptomID) }}
                        >
                          Give some feedback!
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

export default SelectedPatientPage;