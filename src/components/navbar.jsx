import React, { memo, useEffect } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap'
import ModalUser from '../components/modalUser';

import firebase from './../config/firebase.config';


const NavBar = ({ location }) => {

  const currentRole = localStorage.getItem('role');
  const currentUserSignedIn = localStorage.getItem('signedIn') === 'true'
  let userName = '';

  if (JSON.parse(localStorage.getItem('userInfo'))) userName = JSON.parse(localStorage.getItem('userInfo')).name;
  else localStorage.setItem('userInfo', JSON.stringify({uid: '', name: '', email: '', photoURL: ''}));

  const userLogOut = () => {
    firebase.auth.signOut();
    localStorage.setItem('role', null);
    localStorage.setItem('signedIn', false);
    localStorage.setItem('activated', false);
  }

  useEffect(() => {
    firebase.auth.onAuthStateChanged(user => {
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
          localStorage.setItem('activated', idTokenResult.claims.activated);
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
    <Navbar collapseOnSelect expand='lg' bg="dark" variant="dark">
      <Navbar.Brand href='/' title='Home Page'>PhysioAtHome</Navbar.Brand>
      <Navbar.Toggle aria-controls='responsive-navbar-nav' />
      {/* collapse only if loggedin */}
      <Navbar.Collapse >
        <Nav className='mr-auto' activeKey={location.pathname}>
          
          { currentUserSignedIn && <Nav.Link href='/videos'> Videos </Nav.Link> }

          { (currentRole === 'ADMIN' && currentUserSignedIn ) && <Nav.Link href='/admin/manageUsers'> Promote Users </Nav.Link> }
          { (currentRole === 'PHYSIOTHERAPIST' && currentUserSignedIn ) && <Nav.Link href='/physio/personalPatients'> My Patients </Nav.Link> }
          { (currentRole === 'PHYSIOTHERAPIST' && currentUserSignedIn ) && <Nav.Link href='/physio/patientInvites'> Invites </Nav.Link> }
          { (currentRole === 'PATIENT' && currentUserSignedIn ) && <Nav.Link href='/patient/addNewSymptomPage'> Add Symptom </Nav.Link> }
          { (currentRole === 'PATIENT' && currentUserSignedIn ) && <Nav.Link href='/patient/searchphysiotherapist'> Search Physiotherapists </Nav.Link> }
          { (currentRole === 'PATIENT' && currentUserSignedIn ) && <Nav.Link href='/patient/yoursymptoms'> Your Symptoms </Nav.Link> }
          
        </Nav>
      </Navbar.Collapse>
        { currentUserSignedIn
          ? <> 
              <div style={{ marginRight: '1em', color: 'white'}}> { userName } </div>
              <ModalUser userLogOutFunction={userLogOut} />
            </>
          : <Button
              href='/loginPage'
              variant='success'
            > Log In / Sign Up </Button>
        }
        
         
          
    </Navbar>
  )
};

export default memo(NavBar);