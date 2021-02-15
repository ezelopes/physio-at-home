import React, { memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Container, Row, Col, Spinner } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';

import functions from '../../config/firebase.functions';
import toastConfig from '../../config/toast.config';
import 'react-toastify/dist/ReactToastify.css';


const PersonalPatientsPage = () => {
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [loading, setLoading] = useState(true);
  const [physioPatientsList, setPhysioPatientsList] = useState([]);

  useEffect(() => {
    const fetchData = async () => { 
      const response = await getAllPhysioPatients(userInfo.uid);
      setPhysioPatientsList(response.patientsList);
      setLoading(false);
     }
 
     fetchData();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getAllPhysioPatients = async (userID) => {
    try {
      const getAllPhysioPatients = functions.httpsCallable('getAllPhysioPatients');
      const response = await getAllPhysioPatients({ physioID: userID });
      const { patientsList } = response.data;

      return { patientsList };
    } catch (err) {
      toast.error('😔 An error occured when trying to retrieve your patients!', toastConfig);
    }
  }

  const removeConnection = async (e, patientID) => {
    const removeConnectionBTN = e.target;
    try {
      const physioID = userInfo.uid;
      removeConnectionBTN.disabled = true;
      removeConnectionBTN.textContent = 'Loading...';
      removeConnectionBTN.className = 'btn btn-primary';
      
      const removeConnection = functions.httpsCallable('removeConnection');
      await removeConnection({ physioID, patientID });
      
      removeConnectionBTN.textContent = 'Connection Removed!';
      toast.success('🚀 Connection Removed Successfully!', toastConfig);
    } catch (err) {
      toast.error('😔 There was an error removing this connection!', toastConfig);
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
          { Object.keys(physioPatientsList).map((patientID) => {
              return <div id={patientID} key={patientID}>
                <Col lg={true}>
                  <Card>
                    <Card.Body>
                      <Card.Img variant="top" src={ physioPatientsList[patientID].photoURL } />
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
                        onClick={(e) => { removeConnection(e, patientID) }}
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
        </Container>
      }
    </>
  );
}

export default memo(PersonalPatientsPage);