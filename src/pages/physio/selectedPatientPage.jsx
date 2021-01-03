import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Row, Col, Modal } from 'react-bootstrap'

import firebase from '../../config/firebase.config';
import 'react-toastify/dist/ReactToastify.css';

const functions = firebase.functions();

const SelectedPatientPage = (props) => {

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const { patientID, name } = props.location.state;
  const [patientSymptomsList, setPatientSymptoms] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedSymptomID, setSelectedSymptomID] = useState(null);

  useEffect(() => {
    const fetchData = async () => { 
      const response = await getAllPatientSymptoms(patientID);
      setPatientSymptoms(response.symptomList);
     }
 
     fetchData();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleShowModal = (symptomID) => {
    setSelectedSymptomID(symptomID);
    setShowModal(true);
  }

  const handleCloseModal = () => {
    setSelectedSymptomID(null);
    setShowModal(false);
  }

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

  const saveFeedback = async (selectedSymptomID) => {
    try {
      const feedbackContent = document.getElementById(`${selectedSymptomID}-feedbackTextField`).value;

      const feedbackObject = { physioID: userInfo.uid, physioName: userInfo.name, feedbackContent };

      const addFeebackToSymptom = functions.httpsCallable('addFeebackToSymptom');
      const response = await addFeebackToSymptom({ patientID, symptomID: selectedSymptomID, feedbackObject });
      alert(response.data.message);
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
          { Object.keys(patientSymptomsList).map((symptomID) => {
                return <div id={symptomID} key={symptomID}>
                  <Col lg={true}>
                    <Card>
                      <Card.Body>
                        <Card.Title>
                          { patientSymptomsList[symptomID].symptomTitle }
                        </Card.Title>
                        <Card.Text>
                          Body Part: { patientSymptomsList[symptomID].specificBodyPart }
                        </Card.Text>
                        <Card.Text>
                          Pain Range Value: { patientSymptomsList[symptomID].painRangeValue }
                        </Card.Text>
                        <Card.Text>
                          Details: { patientSymptomsList[symptomID].symptomDetails }
                        </Card.Text>
                        <Button 
                          id={`${symptomID}-showModal`}
                          variant="primary"
                          onClick={() => {
                            handleShowModal(symptomID);
                          }}
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

        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title> Write here your feedback to {name} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <textarea  id={`${selectedSymptomID}-feedbackTextField`} style={{ width: '100%', borderRadius: '4px'}}></textarea >
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="success" onClick={() => { 
              saveFeedback(selectedSymptomID)
              handleCloseModal() 
            } }>
              Save Feedback
            </Button>
          </Modal.Footer>
        </Modal>

      </Container>
    </>
  );
}

export default SelectedPatientPage;