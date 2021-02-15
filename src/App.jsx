import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import Navbar from './components/navbar';
import ProtectedRoute from './components/protectedRoute';
import GuestRoute from './components/guestRoute';

import homePage from './pages/homePage';
import loginPage from './pages/loginPage';
import videosPage from './pages/videosPage';
import notFoundPage from './pages/pageNotFound';

import promoteToAdminPage from './pages/admin/promoteUsers';
import addNewSymptomPage from './pages/patient/addNewSymptomPage';
import patientAccountPage from './pages/patient/patientAccountPage';
import searchPhysiotherapistPage from './pages/patient/searchPhysiotherapist';
import yourSymptomsPage from './pages/patient/yourSymptoms';
import physioAccountPage from './pages/physio/physioAccountPage';
import physioPersonalPatientsPage from './pages/physio/personalPatientsPage';
import patientInvitesPage from './pages/physio/patientInvitesPage';
import selectedPatientPage from './pages/physio/selectedPatientPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style/App.css';

const pathsWhereNavbarIsHidden = ['/patient/startUpKinect']
const NavbarWithRouter = withRouter(Navbar);

function App(props) {
  const currentLocation = props.location.pathname;

  const currentRole = localStorage.getItem('role');
  const currentUserSignedIn = (localStorage.getItem('signedIn') === 'true');
  const currentUserActivated = (localStorage.getItem('activated') === 'true'); // need to save it into firestore first

  return (
      <div className="App">
        { pathsWhereNavbarIsHidden.includes(currentLocation) ? <></> : <NavbarWithRouter /> }
        <div id='routes'>
          <Switch>
            <Route path="/" component={homePage} exact />
            <Route path="/videos" component={videosPage} exact />
            <GuestRoute
              path="/loginPage"
              component={loginPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              exact
            />
            <ProtectedRoute
              path="/patient/patientAccountPage"
              component={patientAccountPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              activated={ currentUserActivated }
              roles={{ expectedRole:  'PATIENT', currentRole: currentRole }}
              exact
            />
            <ProtectedRoute
              path="/patient/addNewSymptomPage"
              component={addNewSymptomPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              activated={ currentUserActivated }
              roles={{ expectedRole: 'PATIENT', currentRole: currentRole }}
              exact
            />
            <ProtectedRoute
              path="/patient/searchphysiotherapist"
              component={searchPhysiotherapistPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              activated={ currentUserActivated }
              roles={{ expectedRole: 'PATIENT', currentRole: currentRole }}
              exact
            />
            <ProtectedRoute
              path="/patient/yoursymptoms"
              component={yourSymptomsPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              activated={ currentUserActivated }
              roles={{ expectedRole: 'PATIENT', currentRole: currentRole }}
              exact
            />
            <ProtectedRoute
              path="/physio/physioAccountPage"
              component={physioAccountPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              activated={ currentUserActivated }
              roles={{ expectedRole:  'PHYSIOTHERAPIST', currentRole: currentRole }}
              exact
            />
            <ProtectedRoute
              path="/physio/personalPatients"
              component={physioPersonalPatientsPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              activated={ currentUserActivated }
              roles={{ expectedRole: 'PHYSIOTHERAPIST', currentRole: currentRole }}
              exact
            />
            <ProtectedRoute
              path="/physio/selectedPatient"
              component={selectedPatientPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              activated={ currentUserActivated }
              roles={{ expectedRole: 'PHYSIOTHERAPIST', currentRole: currentRole }}
              exact
            />
            <ProtectedRoute
              path="/physio/patientInvites"
              component={patientInvitesPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              activated={ currentUserActivated }
              roles={{ expectedRole: 'PHYSIOTHERAPIST', currentRole: currentRole }}
              exact
            />
            <ProtectedRoute 
              path="/admin/promoteToAdmin"
              component={promoteToAdminPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              activated={ currentUserActivated }
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
