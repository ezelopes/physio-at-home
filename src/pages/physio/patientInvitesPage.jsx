import React, { memo, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Card, Container, Row, Col, Spinner } from 'react-bootstrap'

import ProfilePlaceHolderPicture from '../../images/profilePlaceholderPicture.jpg'
import firebase from '../../config/firebase.config';
import toastConfig from '../../config/toast.config';
import 'react-toastify/dist/ReactToastify.css';

const PatientInvitesPage = () => {

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [loading, setLoading] = useState(true);
  const [patientInvitesList, setInvitesList] = useState([]);

  useEffect(() => {
    const fetchData = async () => { 
      const response = await getAllPhysioInvites(userInfo.uid);
      setInvitesList(response.invitesList);
      setLoading(false);
     }
 
     fetchData();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getAllPhysioInvites = async (userID) => {
    try {
      const getAllPhysioInvites = firebase.functions.httpsCallable('getAllPhysioInvites');
      const response = await getAllPhysioInvites({ physioID: userID });
      const { invitesList } = response.data;

      return { invitesList };
    } catch (err) {
      toast.error('⚠️ An error occured while retrieving the information!', toastConfig);
    }
  }

  const acceptInviteRequest = async (patientID, name, email, photoURL) => {
    try {
      const physioID =  userInfo.uid;
      document.getElementById(`${patientID}-acceptButton`).disabled = true;
      document.getElementById(`${patientID}-declineButton`).disabled = true;
      document.getElementById(`${patientID}-acceptButton`).textContent = 'Loading...';

      const acceptInviteRequest = firebase.functions.httpsCallable('acceptInviteRequest');
      await acceptInviteRequest({ physioID, patientID, name, email, photoURL });

      document.getElementById(`${patientID}-acceptButton`).textContent = 'Accepted ✔️';
      toast.success('🚀 Invite Accepted Successfully!', toastConfig);
    } catch (err) {
      toast.error('⚠️ There was an error accepting the invite!', toastConfig);
      document.getElementById(`${patientID}-acceptButton`).className = 'btn btn-warning';
      document.getElementById(`${patientID}-acceptButton`).textContent = 'Refresh Page!';
    }
  }
  
  const declineInviteRequest = async (patientID) => {
    try {
      const physioID =  userInfo.uid;
      document.getElementById(`${patientID}-acceptButton`).disabled = true;
      document.getElementById(`${patientID}-declineButton`).disabled = true;
      document.getElementById(`${patientID}-declineButton`).textContent = 'Loading...';

      const declineInviteRequest = firebase.functions.httpsCallable('declineInviteRequest');
      await declineInviteRequest({ physioID, patientID });
      
      document.getElementById(`${patientID}-declineButton`).textContent = 'Declined ❌';
      toast.success('🚀 Invite Declined Successfully!', toastConfig);
    } catch (err) {
      toast.error('⚠️ There was an error declining the invite!', toastConfig);
      document.getElementById(`${patientID}-declineButton`).className = 'btn btn-warning';
      document.getElementById(`${patientID}-declineButton`).textContent = 'Refresh Page!';
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
          
            Object.keys(patientInvitesList).length === 0 ? <h2 className='center'> <div> No Patients Invites Yet </div> </h2>  
            : Object.keys(patientInvitesList).map((patientID, index) => {
              const { name, email, photoURL } = patientInvitesList[patientID];
              return (
                <div id={patientID} key={patientID}>
                  <Col lg={true}>
                    <Card>
                      <Card.Body>
                        <Card.Img variant="top" src={photoURL ? photoURL : ProfilePlaceHolderPicture} />
                        <Card.Title className='first-element' > Name: {name} </Card.Title>
                        <Card.Text>
                          Email: {email}
                        </Card.Text>
                        <Button
                          id={`${patientID}-acceptButton`}
                          variant="success"
                          onClick={() => acceptInviteRequest(patientID, name, email, photoURL)}
                          className='left-button'
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
      }
    </>
  );
}

export default memo(PatientInvitesPage);