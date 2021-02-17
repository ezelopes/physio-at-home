import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import Navbar from './components/navbar';
import ProtectedRoute from './components/CustomRoutes/protectedRoute';
import GuestRoute from './components/CustomRoutes/guestRoute';

import homePage from './pages/homePage';
import loginPage from './pages/loginPage';
import accountSetUpPage from './pages/accountSetUpPage';
import notFoundPage from './pages/pageNotFound';

import videosPage from './pages/videosPage';
import promoteToAdminPage from './pages/admin/promoteUsers';
import addNewSymptomPage from './pages/patient/addNewSymptomPage';
import searchPhysiotherapistPage from './pages/patient/searchPhysiotherapist';
import yourSymptomsPage from './pages/patient/yourSymptoms';
import physioPersonalPatientsPage from './pages/physio/personalPatientsPage';
import patientInvitesPage from './pages/physio/patientInvitesPage';
import selectedPatientPage from './pages/physio/selectedPatientPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style/App.css';

const NavbarWithRouter = withRouter(Navbar);

function App() {

  const currentRole = localStorage.getItem('role');
  const currentUserSignedIn = (localStorage.getItem('signedIn') === 'true');
  const currentUserActivated = (localStorage.getItem('activated') === 'true');

  return (
      <div className="App">
        <NavbarWithRouter />
        <div id='routes'>
          <Switch>
            <Route path="/" component={homePage} exact />
            <GuestRoute
              path="/loginPage"
              component={loginPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              exact
            />            
            <ProtectedRoute
              path="/videos"
              component={videosPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              activated={ currentUserActivated }
              roles={{ expectedRole:  ['PATIENT', 'PHYSIOTHERAPIST'], currentRole: currentRole }}
              exact
            />
            <ProtectedRoute
              path="/patient/patientAccountPage"
              component={accountSetUpPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              activated={ currentUserActivated }
              roles={{ expectedRole:  ['PATIENT'], currentRole: currentRole }}
              exact
            />
            <ProtectedRoute
              path="/patient/addNewSymptomPage"
              component={addNewSymptomPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              activated={ currentUserActivated }
              roles={{ expectedRole: ['PATIENT'], currentRole: currentRole }}
              exact
            />
            <ProtectedRoute
              path="/patient/searchphysiotherapist"
              component={searchPhysiotherapistPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              activated={ currentUserActivated }
              roles={{ expectedRole: ['PATIENT'], currentRole: currentRole }}
              exact
            />
            <ProtectedRoute
              path="/patient/yoursymptoms"
              component={yourSymptomsPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              activated={ currentUserActivated }
              roles={{ expectedRole: ['PATIENT'], currentRole: currentRole }}
              exact
            />
            <ProtectedRoute
              path="/physio/physioAccountPage"
              component={accountSetUpPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              activated={ currentUserActivated }
              roles={{ expectedRole:  ['PHYSIOTHERAPIST'], currentRole: currentRole }}
              exact
            />
            <ProtectedRoute
              path="/physio/personalPatients"
              component={physioPersonalPatientsPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              activated={ currentUserActivated }
              roles={{ expectedRole: ['PHYSIOTHERAPIST'], currentRole: currentRole }}
              exact
            />
            <ProtectedRoute
              path="/physio/selectedPatient"
              component={selectedPatientPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              activated={ currentUserActivated }
              roles={{ expectedRole: ['PHYSIOTHERAPIST'], currentRole: currentRole }}
              exact
            />
            <ProtectedRoute
              path="/physio/patientInvites"
              component={patientInvitesPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              activated={ currentUserActivated }
              roles={{ expectedRole: ['PHYSIOTHERAPIST'], currentRole: currentRole }}
              exact
            />
            <ProtectedRoute 
              path="/admin/promoteToAdmin"
              component={promoteToAdminPage}
              redirectPath="/"
              authenticated={ currentUserSignedIn }
              activated={ currentUserActivated }
              roles={{ expectedRole: ['ADMIN'], currentRole: currentRole }}
              exact
            />
            <Route path="*" component={notFoundPage} />
          </Switch>
        </div>
      </div>
  );
}

export default withRouter(props => <App {...props} />);
