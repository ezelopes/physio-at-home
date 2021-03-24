import React, { memo, useState } from 'react';
import firebase from 'firebase/app';
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
      signInSuccessWithAuthResult: async (authResult) => {
        setLoading(true);

        authResult.user.getIdTokenResult().then(tokenResult => {
          if (tokenResult.claims.role === 'PATIENT') window.location.assign('/patient/yoursymptoms')
          else if (tokenResult.claims.role === 'PHYSIOTHERAPIST') window.location.assign('/physio/personalPatients')
          else if (tokenResult.claims.role === 'ADMIN') window.location.assign('/admin/manageUsers')  
          else window.location.assign('/')
        });
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

export default memo(LoginPage);
