import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import Navbar from './components/navbar';
import ProtectedRoute from './components/protectedRoute';
import GuestRoute from './components/guestRoute';

import homePage from './pages/homePage';
import loginPage from './pages/loginPage';
import bonesPage from './pages/bonesPage';
import musclesPage from './pages/musclesPage';
import notFoundPage from './pages/pageNotFound';

import promoteToAdminPage from './pages/admin/promoteUsers';
import addNewSymptomPage from './pages/patient/addNewSymptomPage';
import searchPhysiotherapistPage from './pages/patient/searchPhysiotherapist';
import yourSymptomsPage from './pages/patient/yourSymptoms';
// import startUpKinectPage from './pages/patient/startUpKinect';
import physioPersonalPatientsPage from './pages/physio/personalPatientsPage';
import patientInvitesPage from './pages/physio/patientInvitesPage';
import selectedPatientPage from './pages/physio/selectedPatientPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style/App.css';

const pathsWhereNavbarIsHidden = ['/patient/startUpKinect']

function App(props) {
  const currentLocation = props.location.pathname;

  const currentRole = localStorage.getItem('role');
  const currentUserSignedIn = (localStorage.getItem('signedIn') === 'true');

  return (
      <div className="App">
        { pathsWhereNavbarIsHidden.includes(currentLocation) ? <></> : <Navbar /> }
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
              path="/patient/addNewSymptomPage"
              component={addNewSymptomPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              roles={{ expectedRole: 'PATIENT', currentRole: currentRole }}
              exact
            />
            <ProtectedRoute
              path="/patient/searchphysiotherapist"
              component={searchPhysiotherapistPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              roles={{ expectedRole: 'PATIENT', currentRole: currentRole }}
              exact
            />
            <ProtectedRoute
              path="/patient/yoursymptoms"
              component={yourSymptomsPage}
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
              path="/physio/selectedPatient"
              component={selectedPatientPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              roles={{ expectedRole: 'PHYSIOTHERAPIST', currentRole: currentRole }}
              exact
            />
            <ProtectedRoute
              path="/physio/patientInvites"
              component={patientInvitesPage}
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
  );
}

export default withRouter(props => <App {...props} />);
