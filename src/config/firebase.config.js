import firebase from 'firebase/app';
import 'firebase/functions';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAAro6Z6xYWql0Ova2lOoufw2i78v1rvMU",
  authDomain: "physioathome-b2cdb.firebaseapp.com",
  databaseURL: "https://physioathome-b2cdb.firebaseio.com",
  projectId: "physioathome-b2cdb",
  storageBucket: "physioathome-b2cdb.appspot.com",
  messagingSenderId: "561723219960",
  appId: "1:561723219960:web:bf66bda025ddcde111800d",
  measurementId: "G-7PNQKRCV73"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

const functions = firebase.app().functions('europe-west1');
const auth = firebase.app().auth();

if (process.env.NODE_ENV === 'development') {
  functions.useEmulator('localhost', 5001);
  auth.useEmulator('http://localhost:9099/')
}

export default { auth, functions };
