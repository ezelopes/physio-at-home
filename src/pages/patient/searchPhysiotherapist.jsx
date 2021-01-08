import React, { useState, useEffect } from 'react';
import { Spinner, Button, Card, Container, Row, Col } from 'react-bootstrap';

import { ToastContainer, toast } from 'react-toastify';

import functions from '../../config/firebase.functions';
import toastConfig from '../../config/toast.config';
import 'react-toastify/dist/ReactToastify.css';

const SearchPhysiotherapistsPage = () => {

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [physiotherapistsList, setPhysiotherapistsList] = useState([]);
  const [patientRequestsList, setPatientRequestsList] = useState([]);
  const [myPhysiotherapistList, setMyPhysiotherapistList] = useState([]);

  useEffect(() => {
    const fetchData = async () => { 
     const patientData = await getPatientData(userInfo.uid);
     if (patientData){
       setPatientRequestsList(patientData.requestsList);
       setMyPhysiotherapistList(patientData.physiotherapistsList);
     }
     const responsePhysio = await getPhysiotherapistsList(); 
     if (responsePhysio) setPhysiotherapistsList(responsePhysio);
    }

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPhysiotherapistsList = async () => {
    try {
      const getAllPhysiotherapists = functions.httpsCallable('getAllPhysiotherapists');
      const response = await getAllPhysiotherapists();

      return response.data.physiotherapists;
    } catch (err) {
      toast.error('😔 An error occured while retrieving the information!', toastConfig);
    }
  }

  const getPatientData = async (userID) => {
    try {
      const getPatientData = functions.httpsCallable('getPatientData');
      const response = await getPatientData({ patientID: userID });

      return response.data.patientData;
    } catch (err) {
      toast.error('😔 An error occured while retrieving the information!', toastConfig);
    }
  }

  const sendInvite = async (physioID) => {
    try {
      document.getElementById(`${physioID}-sendInviteButton`).disabled = true;
      document.getElementById(`${physioID}-sendInviteButton`).textContent = 'Loading...';
      document.getElementById(`${physioID}-sendInviteButton`).className = 'btn btn-primary';
      
      const sendInvite = functions.httpsCallable('sendInvite');
      await sendInvite({ 
        physioID, patientID: userInfo.uid, patientEmail: userInfo.email, patientName: userInfo.name, photoURL: userInfo.photoURL
      });

      document.getElementById(`${physioID}-sendInviteButton`).textContent = 'Invite Sent!';
      toast.success('🚀 Invite Sent Successfully!', toastConfig);
    } catch (err) {
      toast.error('😔 There was an error sending your invite!', toastConfig);
      document.getElementById(`${physioID}-sendInviteButton`).className = 'btn btn-warning'; // -danger?
      document.getElementById(`${physioID}-sendInviteButton`).textContent = 'Refresh Page!';
    }
  }

  const removeConnection = async (physioID) => {
    try {
      document.getElementById(`${physioID}-removeConnectionButton`).disabled = true;
      document.getElementById(`${physioID}-removeConnectionButton`).textContent = 'Loading...';
      document.getElementById(`${physioID}-removeConnectionButton`).className = 'btn btn-primary';
      
      const removeConnection = functions.httpsCallable('removeConnection');
      await removeConnection({ 
        physioID, patientID: userInfo.uid,
      });

      document.getElementById(`${physioID}-removeConnectionButton`).textContent = 'Connection Removed!';
      toast.success('🚀 Connection Removed Successfully!', toastConfig);
    } catch (err) {
      toast.error('😔 There was an error removing this connection!', toastConfig);
      document.getElementById(`${physioID}-removeConnectionButton`).className = 'btn btn-warning';
      document.getElementById(`${physioID}-removeConnectionButton`).textContent = 'Refresh Page!';
    }
  }

  return (
    <>
      <ToastContainer />
      <h2> SEND REQUEST TO YOUR PREFERRED PHYSIOTHERAPISTS </h2>
      <br />

      <Container>
        <Row>
        { physiotherapistsList.length > 0
          ? Array.from(physiotherapistsList).map((physiotherapist, index) => {

            return (
              <div id={index} key={index}>
                <Col lg={true}>
                  <Card>
                    <Card.Body>
                      <Card.Title> {physiotherapist.name} </Card.Title>
                      <Card.Text>
                        Email: {physiotherapist.email}
                      </Card.Text>
                      <Card.Text> 
                        Specialisations: <br />
                        { physiotherapist.specialisations.length === 0
                          ? <b> NOT SPECIALISED </b>
                          : Array.from(physiotherapist.specialisations).map((currentSpec, index) => (
                              <b key={index}> {currentSpec} <br /> </b>
                            ))
                        }
                      </Card.Text>
                      { patientRequestsList.includes(physiotherapist.id) 
                        ? <Button disabled>
                            Invite Sent!
                          </Button>
                        : (myPhysiotherapistList.includes(physiotherapist.id) 
                          ? <Button
                              variant='danger'
                              id={`${physiotherapist.id}-removeConnectionButton`}
                              onClick={() => { removeConnection(physiotherapist.id) }}
                            >
                              Remove Connection
                            </Button>
                          : <Button
                              variant='success'
                              id={`${physiotherapist.id}-sendInviteButton`}
                              onClick={() => { sendInvite(physiotherapist.id) }}>
                              Send Invite
                            </Button>
                        )
                      }
                    </Card.Body>
                  </Card>
                </Col>
              </div>
            )
          }) 
          : <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner> 
        }
        </Row>
      </Container>
    </>
  );
}

export default SearchPhysiotherapistsPage;