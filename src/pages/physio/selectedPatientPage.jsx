import React, { memo, useEffect, useState } from 'react';
import { Button, Card, Container, Row, Col, Modal, ListGroup } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons'
import toastConfig from '../../config/toast.config';
import firebase from '../../config/firebase.config';
import 'react-toastify/dist/ReactToastify.css';

const SelectedPatientPage = (props) => {

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const { patientID, name } = props.location.state;
  const [patientSymptomsList, setPatientSymptoms] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showModalHistory, setShowModalHistory] = useState(false);
  const [selectedSymptomID, setSelectedSymptomID] = useState(null);
  const [currentFeedbackList, setCurrentFeedbackList] = useState([]);
  const [feedbackContent, setFeedbackContent] = useState('');

  useEffect(() => {
    const fetchData = async () => { 
      const response = await getAllPatientSymptoms(patientID);
      setPatientSymptoms(response.symptomList);
      console.log(response.symptomList)
     }
 
     fetchData();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const convertDate = (dateInSeconds) => {
    const pad = (s) => { return (s < 10) ? '0' + s : s; }

    const d = new Date(dateInSeconds * 1000)
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('-')
  }

  const handleShowModalHistory = (symptomID) => {
    console.log(patientSymptomsList[symptomID].feedbackList)
    setCurrentFeedbackList(patientSymptomsList[symptomID].feedbackList)
    setShowModalHistory(true);
  }

  const handleShowModal = (symptomID) => {
    setSelectedSymptomID(symptomID);
    setShowModal(true);
  }

  const handleCloseModal = () => {
    setSelectedSymptomID(null);
    setShowModal(false);
    setFeedbackContent('')
  }
  
  const handleCloseModalHistory = () => {
    setSelectedSymptomID(null);
    setShowModalHistory(false);
  }

  const getAllPatientSymptoms = async (patientID) => {
    try {
      const getAllSymptomsFromPatient = firebase.functions.httpsCallable('getAllSymptomsFromPatient');
      const response = await getAllSymptomsFromPatient({ patientID });
      const { symptomList } = response.data;

      return { symptomList };
    } catch (err) {
      toast.error('⚠️ There was an error retrieving your patient information!', toastConfig)
    }
  }

  const saveFeedback = async (selectedSymptomID) => {
    try {
      if (!feedbackContent.replace(/\s/g,'')) throw new Error ('Feedback Content cannot be empty');
      const feedbackObject = { physioID: userInfo.uid, physioName: userInfo.name, feedbackContent };

      const addFeebackToSymptom = firebase.functions.httpsCallable('addFeebackToSymptom');
      const response = await addFeebackToSymptom({ patientID, symptomID: selectedSymptomID, feedbackObject });
      
      toast.success(`🚀 ${response.data.message}`, toastConfig);
      setFeedbackContent('')
    } catch (err) {
      toast.error(`⚠️ ${err.message}`, toastConfig)
    }
  }

  return (
    <>
      <ToastContainer />
      <Button onClick={() => props.history.goBack() } style={{ marginRight: '90%', boxShadow: '2px 4px' }} > <FontAwesomeIcon icon={faArrowAltCircleLeft} /> GO BACK </Button> 
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
                          Body Part: { 
                            patientSymptomsList[symptomID].bodyPart.rightOrLeft + ' ' + 
                            patientSymptomsList[symptomID].bodyPart.bodyPart
                          }
                        </Card.Text>
                        <Card.Text>
                          Specific Body Part:
                        </Card.Text>
                        <ListGroup style={{ marginBottom: '1em' }}> 
                          { patientSymptomsList[symptomID].bodyPart.specificBodyPart.map((item, index) => { 
                            return <ListGroup.Item key={index}> {item} </ListGroup.Item>}) 
                          }
                        </ListGroup>
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
                          className='left-button'
                          variant="primary"
                          onClick={() => {
                            handleShowModal(symptomID);
                          }}
                        >
                          <span role='img' aria-label='pencil'>✏️</span> 
                          Give Feedback!
                        </Button>
                        
                        <Button 
                          id={`${symptomID}-showModalHistory`}
                          variant="secondary"
                          onClick={() => {
                            handleShowModalHistory(symptomID);
                          }}
                        >
                          <span role='img' aria-label='history'>📜</span> 
                          History
                        </Button>

                      </Card.Body>
                    </Card>
                  </Col>
                </div>
              }) 
            }
        </Row>

        <Modal show={showModalHistory} onHide={handleCloseModalHistory} centered>
          <Modal.Header closeButton>
            <Modal.Title> History of Symptom </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              currentFeedbackList.length !== 0 
              ? currentFeedbackList.map((currentFeedback, index) => {
                  return (<div style={{ marginBottom: '1em' }} key={index}> 
                    <p> {index + 1}. <b> {currentFeedback.physioID === userInfo.uid ? 'You' : currentFeedback.physioName} </b> said on <b> {convertDate(currentFeedback.dateCreated._seconds)} </b>: </p>
                    {currentFeedback.feedbackContent} 
                    <ColoredLine color='#0069D9' />
                  </div>)
                })
              : <div> No feedback to display yet! </div>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModalHistory}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

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

const ColoredLine = ({ color }) => {
  return (
    <hr style={{ color: color, backgroundColor: color }} />
  )
};

export default memo(SelectedPatientPage);