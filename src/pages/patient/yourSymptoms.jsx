import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Row, Col, Modal } from 'react-bootstrap'
import ColoredLine from '../../components/coloredLine'

import firebase from '../../config/firebase.config';
import 'react-toastify/dist/ReactToastify.css';

const functions = firebase.functions();

if (process.env.NODE_ENV === 'development') functions.useFunctionsEmulator("http://localhost:5001");

const YourSymptoms = () => {
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [symptomsList, setSymptoms] = useState({});
  const [currentFeedbackList, setCurrentFeedbackList] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => { 
      const response = await getAllSymptoms(userInfo.uid);
      setSymptoms(response.symptomList);
     }
 
     fetchData();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleShowModal = (currentSymptomID) => { 
    setCurrentFeedbackList(symptomsList[currentSymptomID].feedbackList);
    setShowModal(true);
  }

  const handleCloseModal = () => { 
    setCurrentFeedbackList([]);
    setShowModal(false);
  }

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

  const deleteSymptom = async (patientID, symptomID) => {
    try {
      const deleteSymptomOfPatient = functions.httpsCallable('deleteSymptomOfPatient');
      const response = await deleteSymptomOfPatient({ patientID, symptomID });
      
      alert(response.data.message)

      delete symptomsList[symptomID];
      setSymptoms(symptomsList);
      console.log(symptomsList)
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
                    <Card style={{ width: '22em'}}>
                      <Card.Body>
                        <Card.Title>
                          { symptomsList[currentSymptomID].symptomTitle }
                        </Card.Title>
                        <Card.Text>
                          Body Part: { 
                            symptomsList[currentSymptomID].bodyPart.rightOrLeft + ' ' + 
                            symptomsList[currentSymptomID].bodyPart.bodyPart + ' (' + 
                            symptomsList[currentSymptomID].bodyPart.specificBodyPart + ')' 
                          }
                        </Card.Text>
                        <Card.Text>
                          Pain Range Value: { symptomsList[currentSymptomID].painRangeValue }
                        </Card.Text>
                        <Card.Text>
                          Details: { symptomsList[currentSymptomID].symptomDetails }
                        </Card.Text>
                        <Card.Text>
                          Range of Motion: { 
                            symptomsList[currentSymptomID].rangeOfMotion.minAngle + '° to ' + 
                            symptomsList[currentSymptomID].rangeOfMotion.maxAngle + '°'
                          }
                        </Card.Text>

                        <Button 
                          style={{ marginRight: '1em' }}
                          id={`read-${currentSymptomID}`}
                          variant="success"
                          onClick={() => { handleShowModal(currentSymptomID) }}
                        >
                          Read Feedbacks!
                        </Button>

                        <Button 
                          id={`delete-${currentSymptomID}`}
                          variant="danger"
                          onClick={() => { deleteSymptom(userInfo.uid, currentSymptomID) }}
                        >
                          Delete Symptom
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
            <Modal.Title> Found below your feedback </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}>
            {
              currentFeedbackList.length !== 0 
              ? currentFeedbackList.map((currentFeedback, index) => {
                  return (<div style={{ marginBottom: '1em' }}> 
                    <p> {index + 1}. <b> {currentFeedback.physioName} </b> says: </p>
                    {currentFeedback.feedbackContent} 
                    <ColoredLine color='#0069D9' />
                  </div>)
                })
              : <div> No feedback to display yet! </div>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={() => { handleCloseModal() } }>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

      </Container>
    </>
  );
}

export default YourSymptoms;