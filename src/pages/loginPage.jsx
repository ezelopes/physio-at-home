import React, { useState } from 'react';
import firebase from 'firebase';
import { Spinner } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'


const LoginPage = () => {
  
  const [loading, setLoading] = useState(false);

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
        setLoading(true);
        setTimeout(() => { window.location.pathname = '/' }, 3000)
        return false;
      },
    }
  };

  return (
    <>
      { loading 
        ? <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>   
        : <StyledFirebaseAuth 
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
      }
    </>
  )
}

export default LoginPage;
