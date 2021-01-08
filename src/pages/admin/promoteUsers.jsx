import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

import functions from '../../config/firebase.functions';

const PromoteUsersPage = () => {


  const [adminEmail, setAdminEmail] = useState('');
  const [physiotherapistEmail, setPhysiotherapistEmail] = useState('');

  const makeAdmin = async () => {
    try {
      const setUserAsAdmin = functions.httpsCallable('setUserAsAdmin');
      const response = await setUserAsAdmin({ email: adminEmail });
      setAdminEmail('')
      console.log(response.data.message);
    } catch (err) {
      console.log(err);
    }
  }

  const makePhysiotherapist = async () => {
    try {
      const setUserAsPhysiotherapist = functions.httpsCallable('setUserAsPhysiotherapist');
      const response = await setUserAsPhysiotherapist({ email: physiotherapistEmail });
      setPhysiotherapistEmail('')
      console.log(response.data.message);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <h2> Promote Users Page </h2>
      <Form>
        <Form.Group>
          <Form.Label>New Admin Email address</Form.Label>
          <Form.Control id='newAdminEmail' type="email" placeholder="Enter new Admin Email" onChange={ (e) => setAdminEmail(e.target.value) } />
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

        <Button variant="primary" type='button' onClick={makePhysiotherapist} onChange={ (e) => setPhysiotherapistEmail(e.target.value) }>
          Submit
        </Button>
      </Form>
    </>
  );
}

export default PromoteUsersPage;