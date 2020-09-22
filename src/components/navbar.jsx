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

        user.getIdTokenResult(true).then(idTokenResult => {
          if (!idTokenResult.claims.role) user.reload();

          localStorage.setItem('role', idTokenResult.claims.role);
          localStorage.setItem('signedIn', true);
        })
      }
      else {
        localStorage.setItem('role', null);
        localStorage.setItem('signedIn', false);
      }
    });
  }, []);

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/">PhysioAtHome</Navbar.Brand>
        <Nav className="mr-auto">
          
          { currentUserSignedIn && <Nav.Link href="/muscles"> Muscles </Nav.Link> }
          { currentUserSignedIn && <Nav.Link href="/bones"> Bones </Nav.Link> }

          { (currentRole === 'ADMIN' && currentUserSignedIn ) && <Nav.Link href="/admin/promoteToAdmin"> Promote Users </Nav.Link> }
          { (currentRole === 'PHYSIOTHERAPIST' && currentUserSignedIn ) && <Nav.Link href="/physio/personalPatients"> My Patients </Nav.Link> }
          { (currentRole === 'PATIENT' && currentUserSignedIn ) && <Nav.Link href="/patient/profile"> Your Profile </Nav.Link> }
          { (currentRole === 'PATIENT' && currentUserSignedIn ) && <Nav.Link href="/patient/searchphysiotherapist"> Search Physiotherapists </Nav.Link> }
         
        </Nav>
        <Navbar.Text style={{ marginRight: '1em' }}> 
          { currentRole !== 'null' ? currentRole : '' }
        </Navbar.Text>
      <Form inline>
        { currentUserSignedIn
          ? <Button 
              href='/loginPage'
              variant="outline-info"
              onClick={userLogOut}
            > Log Out </Button>
          : <Button
              href='/loginPage'
              variant="outline-info"
            > Log In </Button>
        }
      </Form>
    </Navbar>
  )
};

export default NavBar;