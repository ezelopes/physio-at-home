import React, { memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Container, Row, Col, Spinner, Modal } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';

import ProfilePlaceHolderPicture from '../../images/profilePlaceholderPicture.jpg'
import firebase from '../../config/firebase.config';
import toastConfig from '../../config/toast.config';
import 'react-toastify/dist/ReactToastify.css';


const PersonalPatientsPage = () => {
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [loading, setLoading] = useState(true);
  const [physioPatientsList, setPhysioPatientsList] = useState([]);
  const [showModalDeleteConfirmation, setShowModalDeleteConfirmation] = useState(false);
  const [selectedPatientID, setSelectedPatientID] = useState('');
  const [currentButtonTarget, setCurrentButtonTarget] = useState('');

  useEffect(() => {
    const fetchData = async () => { 
      const response = await getAllPhysioPatients(userInfo.uid);
      setPhysioPatientsList(response.patientsList);
      setLoading(false);
     }
 
     fetchData();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const handleModalDeleteConfirmation = (buttonTarget, patientID) => {
    setSelectedPatientID(patientID);
    setCurrentButtonTarget(buttonTarget)
    setShowModalDeleteConfirmation(true);
  }

  const handleCloseModalDeleteConfirmation = () => {
    setSelectedPatientID('');
    setShowModalDeleteConfirmation(false);
  }

  const getAllPhysioPatients = async (userID) => {
    try {
      const getAllPhysioPatients = firebase.functions.httpsCallable('getAllPhysioPatients');
      const response = await getAllPhysioPatients({ physioID: userID });
      const { patientsList } = response.data;

      return { patientsList };
    } catch (err) {
      toast.error('⚠️ An error occured when trying to retrieve your patients!', toastConfig);
    }
  }

  const removeConnection = async (target, patientID) => {
    const removeConnectionBTN = target;
    try {
      const physioID = userInfo.uid;
      removeConnectionBTN.disabled = true;
      removeConnectionBTN.textContent = 'Loading...';
      removeConnectionBTN.className = 'btn btn-primary';
      
      const removeConnection = firebase.functions.httpsCallable('removeConnection');
      await removeConnection({ physioID, patientID });
      
      removeConnectionBTN.textContent = 'Connection Removed!';
      toast.success('🚀 Connection Removed Successfully!', toastConfig);
    } catch (err) {
      toast.error('⚠️ There was an error removing this connection!', toastConfig);
      removeConnectionBTN.className = 'btn btn-warning';
      removeConnectionBTN.textContent = 'Refresh Page!';
    }
  }

  return (
    <>
      <ToastContainer />
      { loading ? 
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner> 

      : <Container>
          <Row>
          { 
            
            Object.keys(physioPatientsList).length === 0 ? <h2 className='center'> <div> No Patients Yet. Wait for Connection Requests! </div> </h2>  
            : Object.keys(physioPatientsList).map((patientID) => {
              return <div id={patientID} key={patientID}>
                <Col lg={true}>
                  <Card>
                    <Card.Body>
                      <Card.Img variant="top" src={ physioPatientsList[patientID].photoURL ? physioPatientsList[patientID].photoURL : ProfilePlaceHolderPicture } />
                      <Card.Title className='first-element'> Name: { physioPatientsList[patientID].name } </Card.Title>
                      <Card.Text>
                        Email: { physioPatientsList[patientID].email }
                      </Card.Text>
                      <Link to={{ pathname: `/physio/selectedPatient`, state: { patientID, name: physioPatientsList[patientID].name } }}>
                        <Button variant="primary" className='left-button'> See Details </Button>
                      </Link>
                      <Button 
                        id={`${patientID}-removeConnectionButton`}
                        variant="danger"
                        onClick={(e) => { 
                          handleModalDeleteConfirmation(e.target, patientID)
                        }}
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

          <Modal show={showModalDeleteConfirmation} onHide={handleCloseModalDeleteConfirmation} centered>
          <Modal.Header closeButton>
              <Modal.Title> Delete Confirmation </Modal.Title>
            </Modal.Header>
            <Modal.Body> Are you sure about deleting this Connection? </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => { handleCloseModalDeleteConfirmation() } }>
                Close
              </Button>
              <Button variant="danger" onClick={async (e) => { 
                e.target.disabled = true;
                removeConnection(currentButtonTarget, selectedPatientID).then(() => {
                  handleCloseModalDeleteConfirmation()
                }).catch(() => {})
              } }>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      }
    </>
  );
}

export default memo(PersonalPatientsPage);