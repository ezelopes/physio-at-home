import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Row, Col, Modal } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';

import toastConfig from '../../config/toast.config';
import functions from '../../config/firebase.functions';
import 'react-toastify/dist/ReactToastify.css';

const SelectedPatientPage = (props) => {

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const { patientID, name } = props.location.state;
  const [patientSymptomsList, setPatientSymptoms] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedSymptomID, setSelectedSymptomID] = useState(null);
  const [feedbackContent, setFeedbackContent] = useState('');

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
    setFeedbackContent('')
  }

  const getAllPatientSymptoms = async (patientID) => {
    try {
      const getAllSymptomsFromPatient = functions.httpsCallable('getAllSymptomsFromPatient');
      const response = await getAllSymptomsFromPatient({ patientID });
      const { symptomList } = response.data;

      return { symptomList };
    } catch (err) {
      toast.error('😔 There was an error retrieving your patient information!', toastConfig)
    }
  }

  const saveFeedback = async (selectedSymptomID) => {
    try {
      const feedbackObject = { physioID: userInfo.uid, physioName: userInfo.name, feedbackContent };

      const addFeebackToSymptom = functions.httpsCallable('addFeebackToSymptom');
      const response = await addFeebackToSymptom({ patientID, symptomID: selectedSymptomID, feedbackObject });
      
      toast.success(`🚀 ${response.data.message}`, toastConfig);
      setFeedbackContent('')
    } catch (err) {
      toast.error('😔 There was an error saving your feedback!', toastConfig)
    }
  }

  return (
    <>
      <ToastContainer />
      <Button onClick={() => props.history.goBack() } style={{ marginRight: '90%'}} > <span role="img" aria-label="back"> ⬅️ </span> GO BACK </Button> 
      <h2> List of Symptoms of {name} </h2>
      <Container>
        <Row>
          { Object.keys(patientSymptomsList).map((symptomID) => {
                return <div id={symptomID} key={symptomID}>
                  <Col lg={true}>
                    <Card style={{ width: '23em' }}>
                      <Card.Body style={{'max-height': '40vh', 'overflow-y': 'auto'}}>
                        <Card.Title>
                          { patientSymptomsList[symptomID].symptomTitle }
                        </Card.Title>
                        <Card.Text>
                          Body Part: { 
                            patientSymptomsList[symptomID].bodyPart.rightOrLeft + ' ' + 
                            patientSymptomsList[symptomID].bodyPart.bodyPart + ' (' + 
                            patientSymptomsList[symptomID].bodyPart.specificBodyPart + ')' 
                          }
                        </Card.Text>
                        <Card.Text>
                          Pain Range Value: { patientSymptomsList[symptomID].painRangeValue }
                        </Card.Text>
                        <Card.Text>
                          Details: { patientSymptomsList[symptomID].symptomDetails }
                        </Card.Text>
                        <Card.Text>
                          Range of Motion: { 
                            patientSymptomsList[symptomID].rangeOfMotion.minAngle + '° to ' + 
                            patientSymptomsList[symptomID].rangeOfMotion.maxAngle + '°'
                          }
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
            <textarea  
              id={`${selectedSymptomID}-feedbackTextField`}
              style={{ width: '100%', borderRadius: '4px'}}
              onChange={(e) => setFeedbackContent(e.target.value)}
            ></textarea >
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