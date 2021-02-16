import React, { memo, useState, useEffect } from 'react';
import { Button, Container, Row, Modal, Spinner } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';
import ColoredLine from '../../components/coloredLine'
import SymptomsDisplayer from '../../components/symptomsDisplayer'

import toastConfig from '../../config/toast.config';

import firebase from '../../config/firebase.config';
import 'react-toastify/dist/ReactToastify.css';

const YourSymptoms = () => {
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [loading, setLoading] = useState(true);
  const [symptomsList, setSymptoms] = useState({});
  const [currentFeedbackList, setCurrentFeedbackList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    const fetchData = async () => { 
      const response = await getAllSymptoms(userInfo.uid);
      setSymptoms(response.symptomList);
      setLoading(false);
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
      const getAllSymptomsFromPatient = firebase.functions.httpsCallable('getAllSymptomsFromPatient');
      const response = await getAllSymptomsFromPatient({ patientID });
      const { symptomList } = response.data;

      return { symptomList };
    } catch (err) {
      toast.error('😔 An error occured while retrieving your symptoms!', toastConfig);
    }
  }

  const deleteSymptom = async (patientID, symptomID) => {
    try {
      const deleteSymptomOfPatient = firebase.functions.httpsCallable('deleteSymptomOfPatient');
      const response = await deleteSymptomOfPatient({ patientID, symptomID });
      toast.success(`🚀 ${response.data.message}`, toastConfig);

      delete symptomsList[symptomID];
      setSymptoms(symptomsList);
      setUpdated(!updated);
    } catch (err) {
      toast.error('😔 There was an error deleting your symptom!', toastConfig);
    }
  }

  return (
    <>
    <ToastContainer />
    { loading
      ? <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner> 
      : <Container>
        <Row>
          <SymptomsDisplayer updated={updated} symptoms={symptomsList} deleteSymptom={deleteSymptom} handleShowModal={handleShowModal}  userInfo={userInfo} />
        </Row>

        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title> Found below your feedback </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{'maxHeight': 'calc(100vh - 150px)', 'overflowY': 'auto'}}>
            {
              currentFeedbackList.length !== 0 
              ? currentFeedbackList.map((currentFeedback, index) => {
                  return (<div style={{ marginBottom: '1em' }} key={index}> 
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
    }
    </>
  );
}

export default memo(YourSymptoms);