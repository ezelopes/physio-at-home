import React from 'react';
import firebase from 'firebase';
import { Spinner } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'


const LoginPage = () => {
  const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: async () => {
        document.getElementById('auth-div').style.display = 'none';
        document.getElementById('load-div').style.display = 'block';
        setTimeout(() => { window.location.pathname = '/' }, 2000)
        return false;
      },
    }
  };

  return (
    <>
      <div id='auth-div' style={{ display: 'block' }}>
        <StyledFirebaseAuth 
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </div>
      <div id='load-div' style={{ marginTop: '5em', display: 'none' }} > 
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner> 
      </div>
    </>
  )
}

export default LoginPage;
