import React from 'react';
import { Button, Form } from 'react-bootstrap';

import firebase from '../../config/firebase.config';

const functions = firebase.functions();

const ProfilePage = () => {

  const makeAdmin = async () => {
    try {
      const newAdminEmail = document.getElementById('newAdminEmail').value;
      console.log(newAdminEmail);
      const setUserAsAdmin = functions.httpsCallable('setUserAsAdmin');
      const response = await setUserAsAdmin({ email: newAdminEmail });
      console.log(response.data.message);
      alert(response.data.message);
    } catch (err) {
      console.log(err);
    }
  }

  const makePhysiotherapist = async () => {
    try {
      const newPhysiotherapistEmail = document.getElementById('newPhysiotherapistEmail').value;
      console.log(newPhysiotherapistEmail);
      const setUserAsPhysiotherapist = functions.httpsCallable('setUserAsPhysiotherapist');
      const response = await setUserAsPhysiotherapist({ email: newPhysiotherapistEmail });
      console.log(response.data.message);
      alert(response.data.message);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div> Promote Users Page </div>
      <Form>
        <Form.Group>
          <Form.Label>New Admin Email address</Form.Label>
          <Form.Control id='newAdminEmail' type="email" placeholder="Enter new Admin Email" />
        </Form.Group>

        <Button variant="primary" type='button' onClick={makeAdmin}>
          Submit
        </Button>
      </Form>
      <br/><br/>
      <Form>
        <Form.Group>
          <Form.Label>New Physiotherapist Email address</Form.Label>
          <Form.Control id='newPhysiotherapistEmail' type="email" placeholder="Enter new Physiotherapist Email" />
        </Form.Group>

        <Button variant="primary" type='button' onClick={makePhysiotherapist}>
          Submit
        </Button>
      </Form>
    </>
  );
}

export default ProfilePage;