import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Card, Container, Row, Col } from 'react-bootstrap'

import functions from '../../config/firebase.functions';
import toastConfig from '../../config/toast.config';
import 'react-toastify/dist/ReactToastify.css';

const PatientInvitesPage = () => {

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [patientInvitesList, setInvitesList] = useState([]);


  useEffect(() => {
    const fetchData = async () => { 
      const response = await getAllPhysioInvites(userInfo.uid);
      setInvitesList(response.invitesList);
     }
 
     fetchData();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getAllPhysioInvites = async (userID) => {
    try {
      const getAllPhysioInvites = functions.httpsCallable('getAllPhysioInvites');
      const response = await getAllPhysioInvites({ physioID: userID });
      const { invitesList } = response.data;
      console.log(invitesList)

      return { invitesList };
    } catch (err) {
      toast.error('😔 An error occured while retrieving the information!', toastConfig);
    }
  }

  const acceptInviteRequest = async (patientID, name, email, photoURL) => {
    try {
      console.log({ physioID: userInfo.uid, patientID, name, email, photoURL });
      const physioID =  userInfo.uid;
      document.getElementById(`${patientID}-acceptButton`).disabled = true;
      document.getElementById(`${patientID}-declineButton`).disabled = true;
      document.getElementById(`${patientID}-acceptButton`).textContent = 'Loading...';

      const acceptInviteRequest = functions.httpsCallable('acceptInviteRequest');
      const response = await acceptInviteRequest({ physioID, patientID, name, email, photoURL });
      console.log(response);

      document.getElementById(`${patientID}-acceptButton`).textContent = 'Accepted ✔️';
      toast.success('🚀 Invite Accepted Successfully!', toastConfig);
    } catch (err) {
      toast.error('😔 There was an error accepting the invite!', toastConfig);
      document.getElementById(`${patientID}-acceptButton`).className = 'btn btn-warning'; // -danger?
      document.getElementById(`${patientID}-acceptButton`).textContent = 'Refresh Page!';
    }
  }
  
  const declineInviteRequest = async (patientID) => {
    // ❌
    try {
      console.log({ physioID: userInfo.uid, patientID });
      const physioID =  userInfo.uid;
      document.getElementById(`${patientID}-acceptButton`).disabled = true;
      document.getElementById(`${patientID}-declineButton`).disabled = true;
      document.getElementById(`${patientID}-declineButton`).textContent = 'Loading...';

      const declineInviteRequest = functions.httpsCallable('declineInviteRequest');
      const response = await declineInviteRequest({ physioID, patientID });
      console.log(response);

      document.getElementById(`${patientID}-declineButton`).textContent = 'Declined ❌';
      toast.success('🚀 Invite Declined Successfully!', toastConfig);
    } catch (err) {
      toast.error('😔 There was an error declining the invite!', toastConfig);
      document.getElementById(`${patientID}-declineButton`).className = 'btn btn-warning'; // -danger?
      document.getElementById(`${patientID}-declineButton`).textContent = 'Refresh Page!';
    }
  }

  return (
    <>
      <ToastContainer />
      <Container>
        <Row>
        { Object.keys(patientInvitesList).map((patientID, index) => {
            const { name, email, photoURL } = patientInvitesList[patientID];
            return (
              <div id={patientID} key={patientID}>
                <Col lg={true}>
                  <Card>
                    <Card.Body>
                      <Card.Img variant="top" src={photoURL} style={{ borderRadius: '50%' }} />
                      <Card.Title style={{ marginTop: '1em'}} > Name: {name} </Card.Title>
                      <Card.Text>
                        Email: {email}
                      </Card.Text>
                      <Button
                        id={`${patientID}-acceptButton`}
                        variant="success"
                        onClick={() => acceptInviteRequest(patientID, name, email, photoURL)}
                        style={{ marginRight: '1em' }}
                      >
                        Accept Invite
                      </Button>
                      <Button id={`${patientID}-declineButton`} variant="danger" onClick={() => declineInviteRequest(patientID)}>
                        Decline Invite
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </div>
            )
          }) 
        }
        </Row>
      </Container>
    </>
  );
}

export default PatientInvitesPage;