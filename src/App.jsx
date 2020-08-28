import React, { useState, useEffect } from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import firebase from 'firebase';

import Navbar from './components/navbar';
import ProtectedRoute from './components/protectedRoute';
import GuestRoute from './components/guestRoute';
import auth from './helpers/auth';
import firebaseConfig from './config/firebase.config';

import homePage from './pages/homePage';
import loginPage from './pages/loginPage';
import bonesPage from './pages/bonesPage';
import musclesPage from './pages/musclesPage';
import profilePage from './pages/profilePage';
import notFoundPage from './pages/pageNotFound';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style/App.css';

firebase.initializeApp(firebaseConfig);

function App() {
  const [ authentication, setAuthentication ] = useState({
    authenticated: false,
    initializing: true
  });

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (!!user) {
        setAuthentication({
          authenticated: true,
          initializing: false
        });
        localStorage.setItem('userSignedIn', true);
        auth.login()
      }
      else {
        setAuthentication({
          authenticated: false,
          initializing: false
        });
        localStorage.setItem('userSignedIn', false);
        auth.logout()
      }
    });
  }, [setAuthentication]);

  // if (authentication.initializing) {
  //   return <div>Loading</div>;
  // }

  return (
    <Router>
      <div className="App">
        <Navbar authenticated={authentication.authenticated} />
        <div style={{ marginTop: '1.5rem', marginLeft: '4rem', marginRight: '4rem' }}>
          <Switch>
            <Route path="/" component={homePage} exact />
            <Route path="/muscles" component={musclesPage} exact />
            <Route path="/bones" component={bonesPage} exact />
            <GuestRoute path="/loginPage" authenticated={authentication.authenticated} component={loginPage} redirectPath="/" exact />
            <ProtectedRoute path="/profile" authenticated={authentication.authenticated} component={profilePage} redirectPath="/loginPage" exact />
            <Route path="*" component={notFoundPage} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
