import React, { memo, useState, useEffect } from 'react';
import { Button, Container, Row, Modal, Spinner } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';
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

  const convertDate = (dateInSeconds) => {
    const pad = (s) => { return (s < 10) ? '0' + s : s; }

    const d = new Date(dateInSeconds * 1000)
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('-')
  }

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
      toast.error('⚠️ An error occured while retrieving your symptoms!', toastConfig);
    }
  }

  const deleteSymptom = async (patientID, symptomID) => {
    try {

      // Pop Up for Confirmation

      const deleteSymptomOfPatient = firebase.functions.httpsCallable('deleteSymptomOfPatient');
      const response = await deleteSymptomOfPatient({ patientID, symptomID });
      toast.success(`🚀 ${response.data.message}`, toastConfig);

      delete symptomsList[symptomID];
      setSymptoms(symptomsList);
      setUpdated(!updated);
    } catch (err) {
      toast.error('⚠️ There was an error deleting your symptom!', toastConfig);
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

        {/* <Modal show={showModalDelete} onHide={handleCloseModalDelete} centered>
        <Modal.Header closeButton>
            <Modal.Title> Delete Confirmation </Modal.Title>
          </Modal.Header>
          <Modal.Body> Are you sure about deleting this Symptom? </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { handleCloseModalDelete() } }>
              Close
            </Button>
            <Button variant="danger" onClick={() => { deleteSymptom() } }>
              Delete
            </Button>
          </Modal.Footer>
        </Modal> */}

        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title> Found below your feedback </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{'maxHeight': 'calc(100vh - 150px)', 'overflowY': 'auto'}}>
            {
              currentFeedbackList.length !== 0 
              ? currentFeedbackList.map((currentFeedback, index) => {
                  return (<div style={{ marginBottom: '1em' }} key={index}> 
                    <p> {index + 1}. <b> {currentFeedback.physioName} </b> said on <b> {convertDate(currentFeedback.dateCreated._seconds)} </b>: </p>
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

const ColoredLine = ({ color }) => {
  return (
    <hr style={{ color: color, backgroundColor: color }} />
  )
};

export default memo(YourSymptoms);