import React, { useEffect } from 'react';
import { Navbar, Nav, Form, Button } from 'react-bootstrap'
import firebase from './../config/firebase.config';

const NavBar = () => {

  const currentRole = localStorage.getItem('role');
  const currentUserSignedIn = (localStorage.getItem('signedIn') === 'true')

  const userLogOut = () => {
    firebase.auth().signOut();
    localStorage.setItem('role', null);
    localStorage.setItem('signedIn', false);
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (!!user) {
        const userInfo = { 
          uid: user.uid, 
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }
        user.getIdTokenResult(true).then(async (idTokenResult) => {
          if (!idTokenResult.claims.role) await user.reload();

          localStorage.setItem('role', idTokenResult.claims.role);
          localStorage.setItem('signedIn', true);
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
        })
      }
      else {
        localStorage.setItem('role', null);
        localStorage.setItem('signedIn', false);
      }
    });
  }, []);

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="/">PhysioAtHome</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="mr-auto">
        
        { currentUserSignedIn && <Nav.Link href="/muscles"> Muscles </Nav.Link> }
        { currentUserSignedIn && <Nav.Link href="/bones"> Bones </Nav.Link> }

        { (currentRole === 'ADMIN' && currentUserSignedIn ) && <Nav.Link href="/admin/promoteToAdmin"> Promote Users </Nav.Link> }
        { (currentRole === 'PHYSIOTHERAPIST' && currentUserSignedIn ) && <Nav.Link href="/physio/personalPatients"> My Patients </Nav.Link> }
        { (currentRole === 'PHYSIOTHERAPIST' && currentUserSignedIn ) && <Nav.Link href="/physio/patientInvites"> Invites </Nav.Link> }
        { (currentRole === 'PATIENT' && currentUserSignedIn ) && <Nav.Link href="/patient/addNewSymptomPage"> Add New Symptom </Nav.Link> }
        { (currentRole === 'PATIENT' && currentUserSignedIn ) && <Nav.Link href="/patient/searchphysiotherapist"> Search Physiotherapists </Nav.Link> }
        
      </Nav>
        <Navbar.Text style={{ marginRight: '1em' }}> 
          { currentRole !== 'null' ? currentRole : '' }
        </Navbar.Text>
        <Form>
          { currentUserSignedIn
            ? <Button 
                href='/loginPage'
                variant="danger"
                onClick={userLogOut}
              > Log Out </Button>
            : <Button
                href='/loginPage'
                variant="success"
              > Log In / Sign Up </Button>
          }
        </Form>
      </Navbar.Collapse>
    </Navbar>
  )
};

export default NavBar;