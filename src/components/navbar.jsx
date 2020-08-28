import React, { useEffect } from 'react';
import { Navbar, Nav, Form, Button } from 'react-bootstrap'
import firebase from 'firebase'

import auth from '../helpers/auth'

const NavBar = ({ authenticated }) => {

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (!!user) auth.login()
      else auth.logout()
    });
  });

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/">PhysioAtHome</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/muscles">Muscles</Nav.Link>
          <Nav.Link href="/bones">Bones</Nav.Link>
          <Nav.Link href="/profile">Your Profile (P*)</Nav.Link>
        </Nav>
      <Form inline>
        { authenticated // auth.isAuthenticated()
          ? <Button 
              href='/loginPage'
              variant="outline-info"
              onClick={ () => { firebase.auth().signOut() } }
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