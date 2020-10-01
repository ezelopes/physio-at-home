import React, { useState, useEffect } from 'react';
import firebase from '../../config/firebase.config';

import { Button, Card, Container, Row, Col } from 'react-bootstrap'

const functions = firebase.functions();

if (process.env.NODE_ENV === 'development') functions.useFunctionsEmulator("http://localhost:5001");

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
      console.log(err);
    }
  }

  const acceptInviteRequest = async (patientID, name, email, photoURL) => {
    console.log({ physioID: userInfo.uid, patientID, name, email, photoURL });
    const physioID =  userInfo.uid;
    const acceptInviteRequest = functions.httpsCallable('acceptInviteRequest');
    const response = await acceptInviteRequest({ physioID, patientID, name, email, photoURL });
    console.log(response);
  }
  
  const declineInviteRequest = async (patientID) => {
    const physioID =  userInfo.uid;
    const declineInviteRequest = functions.httpsCallable('declineInviteRequest');
    const response = await declineInviteRequest({ physioID, patientID });
    console.log(response);
  }

  return (
    <>
      <Container style={{ maxWidth: '100%' }}>
        <Row>
        { Object.keys(patientInvitesList).map((patientID, index) => {
            const { name, email, photoURL } = patientInvitesList[patientID];
            return (
              <div id={patientID} key={patientID}>
                <Col lg={true} style={{ marginTop: '1.5em' }}>
                  <Card style={{ width: '20em' }}>
                    <Card.Body>
                      <Card.Img variant="top" src={photoURL} style={{ borderRadius: '50%' }} />
                      <Card.Title style={{ marginTop: '1em'}} > Name: {name} </Card.Title>
                      <Card.Text>
                        Email: {email}
                      </Card.Text>
                      <Button variant="success" onClick={() => acceptInviteRequest(patientID, name, email, photoURL)} style={{ marginRight: '1em' }}>
                        Accept Invite
                      </Button>
                      <Button variant="danger" onClick={() => declineInviteRequest(patientID)}>
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