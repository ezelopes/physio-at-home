import React from 'react';
import  { Redirect } from 'react-router-dom'
import firebase from 'firebase';

import 'bootstrap/dist/css/bootstrap.min.css';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'

// import auth from '../helpers/auth';

const LoginPage = (props) => {
  const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccess: () => {
        // auth.login()
        return <Redirect to='/' />
      },
    }
  };

  return (
    <>
      <StyledFirebaseAuth 
        uiConfig={uiConfig}
        firebaseAuth={firebase.auth()}
      />
    </>
  )
}

export default LoginPage;

/**
 * No redirect URL has been found.
 *  You must either specify a signInSuccessUrl in the configuration,
 *  pass in a redirect URL to the widget URL, or return false from the callback
 */