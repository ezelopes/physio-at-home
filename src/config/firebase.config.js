import firebase from 'firebase/app';
import 'firebase/functions';
import 'firebase/auth';


require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

const functions = firebase.app().functions('europe-west1');
const auth = firebase.app().auth();

if (process.env.NODE_ENV === 'development') {
  functions.useEmulator('localhost', 5001);
  auth.useEmulator('http://localhost:9099/')
}

export default { auth, functions };
