import React, { useState, useEffect } from 'react';
import { Spinner, Button, Card, Container, Row, Col } from 'react-bootstrap';

import { ToastContainer, toast } from 'react-toastify';

import firebase from '../../config/firebase.config';
import toastConfig from '../../config/toast.config';
import 'react-toastify/dist/ReactToastify.css';

const functions = firebase.functions();

if (process.env.NODE_ENV === 'development') functions.useFunctionsEmulator("http://localhost:5001");

const SearchPhysiotherapistsPage = () => {

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [physiotherapistsList, setPhysiotherapistsList] = useState([]);
  const [patientRequestsList, setPatientRequestsList] = useState([]);
  const [myPhysiotherapistList, setMyPhysiotherapistList] = useState([]);

  useEffect(() => {
    const fetchData = async () => { 
     const responsePhysio = await getPhysiotherapistsList(); 
     if (responsePhysio) setPhysiotherapistsList(responsePhysio);
     const patientData = await getPatientData(userInfo.uid);
     if (patientData){
       setPatientRequestsList(patientData.requestsList);
       setMyPhysiotherapistList(patientData.physiotherapistsList);
     }
    }

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPhysiotherapistsList = async () => {
    try {
      const getAllPhysiotherapists = functions.httpsCallable('getAllPhysiotherapists');
      const response = await getAllPhysiotherapists();
      console.log(response);

      return response.data.physiotherapists;
    } catch (err) {
      console.log(err);
    }
  }

  const getPatientData = async (userID) => {
    try {
      const getPatientData = functions.httpsCallable('getPatientData');
      const response = await getPatientData({ patientID: userID });
      console.log(response.data.patientData)

      return response.data.patientData;
    } catch (err) {
      console.log(err);
    }
  }

  const sendInvite = async (physioID) => {
    try {
      console.log({ physioID, patientID: userInfo.uid, patientEmail: userInfo.email, patientName: userInfo.name })
      document.getElementById(`${physioID}-sendInviteButton`).disabled = true;
      document.getElementById(`${physioID}-sendInviteButton`).textContent = 'Loading...';
      document.getElementById(`${physioID}-sendInviteButton`).className = 'btn btn-primary';
      
      const sendInvite = functions.httpsCallable('sendInvite');
      const response = await sendInvite({ 
        physioID, patientID: userInfo.uid, patientEmail: userInfo.email, patientName: userInfo.name, photoURL: userInfo.photoURL
      });
      console.log(response);

      document.getElementById(`${physioID}-sendInviteButton`).textContent = 'Invite Sent!';
      toast.success('🚀 Invite Sent Successfully!', toastConfig);
    } catch (err) {
      toast.error('😔 There was an error sending your invite!', toastConfig);
      document.getElementById(`${physioID}-sendInviteButton`).className = 'btn btn-warning'; // -danger?
      document.getElementById(`${physioID}-sendInviteButton`).textContent = 'Refresh Page!';
      // console.log(err);
    }
  }

  const removeConnection = async (physioID) => {
    try {
      console.log({ physioID, patientID: userInfo.uid, patientEmail: userInfo.email, patientName: userInfo.name })
      document.getElementById(`${physioID}-removeConnectionButton`).disabled = true;
      document.getElementById(`${physioID}-removeConnectionButton`).textContent = 'Loading...';
      document.getElementById(`${physioID}-removeConnectionButton`).className = 'btn btn-primary';
      
      const removeConnection = functions.httpsCallable('removeConnection');
      const response = await removeConnection({ 
        physioID, patientID: userInfo.uid,
      });
      console.log(response);

      document.getElementById(`${physioID}-removeConnectionButton`).textContent = 'Connection Removed!';
      toast.success('🚀 Connection Removed Successfully!', toastConfig);
    } catch (err) {
      toast.error('😔 There was an error removing this connection!', toastConfig);
      document.getElementById(`${physioID}-removeConnectionButton`).className = 'btn btn-warning';
      document.getElementById(`${physioID}-removeConnectionButton`).textContent = 'Refresh Page!';
      // console.log(err);
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
                        Specialisation:
                        { physiotherapist.specialisation.length === 0
                          ? <h6> NOT SPECIALISED </h6>
                          : Array.from(physiotherapist.specialisation).map((currentSpec, index) => (
                              <h6 key={index}>{currentSpec}</h6>
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