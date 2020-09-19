import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';

import Navbar from './components/navbar';
import ProtectedRoute from './components/protectedRoute';
import GuestRoute from './components/guestRoute';

import homePage from './pages/homePage';
import loginPage from './pages/loginPage';
import bonesPage from './pages/bonesPage';
import musclesPage from './pages/musclesPage';
import notFoundPage from './pages/pageNotFound';

import promoteToAdminPage from './pages/admin/promoteUsers';
import patientProfilePage from './pages/patient/profilePage';
import physioPersonalPatientsPage from './pages/physio/personalPatientsPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style/App.css';


function App() {
  const currentRole = localStorage.getItem('role');
  const currentUserSignedIn = (localStorage.getItem('signedIn') === 'true')

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div style={{ marginTop: '1.5rem', marginLeft: '4rem', marginRight: '4rem' }}>
          <Switch>
            <Route path="/" component={homePage} exact />
            <Route path="/muscles" component={musclesPage} exact />
            <Route path="/bones" component={bonesPage} exact />
            <GuestRoute
              path="/loginPage"
              component={loginPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              exact
            />
            <ProtectedRoute
              path="/patient/profile"
              component={patientProfilePage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              roles={{ expectedRole: 'PATIENT', currentRole: currentRole }}
              exact
            />
            <ProtectedRoute
              path="/physio/personalPatients"
              component={physioPersonalPatientsPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              roles={{ expectedRole: 'PHYSIOTHERAPIST', currentRole: currentRole }}
              exact
            />
            <ProtectedRoute 
              path="/admin/promoteToAdmin"
              component={promoteToAdminPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              roles={{ expectedRole: 'ADMIN', currentRole: currentRole }}
              exact
            />
            <Route path="*" component={notFoundPage} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
