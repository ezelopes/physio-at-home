const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors =  require('cors')({ origin: true });

admin.initializeApp();
const db = admin.firestore();

// exports.temp = functions.region('europe-west1').https.onCall(async (req, res) => {});

exports.declineInviteRequest = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { physioID, patientID } = req.body.data;
      console.log(physioID, patientID)

      await db.collection('PHYSIOTHERAPISTS').doc(physioID).collection('INVITES').doc(patientID).delete();

      console.log('Declined successfully!');
      res.send({ data: { message: 'Patient Declined!' } });
    } catch (err) {
      console.log(err);
      res.send({ data: 'There was an error with the request!' })
    }
  });
});

exports.acceptInviteRequest = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { physioID, patientID, name, email, photoURL } = req.body.data;
      console.log(physioID, patientID, name, email, photoURL)

      await db.collection('PHYSIOTHERAPISTS').doc(physioID).collection('PATIENTS').doc(patientID).set({ name, email, photoURL });
      await db.collection('PHYSIOTHERAPISTS').doc(physioID).collection('INVITES').doc(patientID).delete();

      console.log('Accepted successfully!');
      res.send({ data: { message: 'Patient Added!' } });
    } catch (err) {
      console.log(err);
      res.send({ data: 'There was an error with the request!' })
    }
  });
});

exports.getAllPhysioInvites =  functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      console.log(req.body.data);

      const invitesList = {};
      const { physioID } = req.body.data;
      
      const invitesDoc = await db.collection('PHYSIOTHERAPISTS').doc(physioID).collection('INVITES').get();
      
      invitesDoc.forEach((currentPatient) => {
        const currentPatientInfo = currentPatient.data();
        invitesList[currentPatient.id] = currentPatientInfo; 
      })

      console.log(invitesList);

      res.send({ data: { invitesList } });
    } catch (err) {
      console.log(err);
      res.send({ data: 'There was an error with the request!' })
    }
  });
});

exports.getAllPhysioPatients = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      console.log(req.body.data);

      const patientsList = {};
      const { physioID } = req.body.data;
      
      const patientsDoc = await db.collection('PHYSIOTHERAPISTS').doc(physioID).collection('PATIENTS').get();
      
      patientsDoc.forEach((currentPatient) => {
        const currentPatientInfo = currentPatient.data();
        patientsList[currentPatient.id] = currentPatientInfo; 
      })

      console.log(patientsList);

      res.send({ data: { patientsList } });
    } catch (err) {
      console.log(err);
      res.send({ data: 'There was an error with the request!' })
    }
  });
});

exports.sendInvite = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      functions.logger.info("Req Body", { body: req.body.data });
      
      const { physioID, patientID, patientEmail, patientName, photoURL } = req.body.data;
      
      await db.collection('PHYSIOTHERAPISTS').doc(physioID).collection('INVITES').doc(patientID).set({
        name: patientName,
        email: patientEmail,
        photoURL: photoURL
      })

      await db.collection('PATIENTS').doc(patientID).update({
        requestsList: admin.firestore.FieldValue.arrayUnion(physioID)
      })

      res.send({ data: { message: 'Request sent!' } })
    } catch (err) {
      console.log(err);
      res.send({ data: 'There was an error with the request!' })
    }
  });
});

exports.getPatientData = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const patientDoc = await db.collection('PATIENTS').doc(req.body.data.patientID).get();
      
      let patientData = null;
      if (patientDoc.exists) patientData = patientDoc.data();

      functions.logger.info('Patient Data', { body: patientData });

      res.send({ data: { patientData } });
    } catch (err) {
      console.log(err);
      res.send({ data: 'There was an error with the request!' })
    }
  });
});

exports.getAllPhysiotherapists = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const physiotherapistsList = [];
      const physiotherapists = await db.collection('PHYSIOTHERAPISTS').get();

      physiotherapists.forEach((currentPhysiotherapist) => {
        const currentPhysiotherapistInfo = currentPhysiotherapist.data();
        currentPhysiotherapistInfo.id = currentPhysiotherapist.id;
        physiotherapistsList.push(currentPhysiotherapistInfo);
        functions.logger.info('Current Physiotherapists', { id: currentPhysiotherapist.id, body: currentPhysiotherapist.data() });
      });


      functions.logger.info('Retrieved Physiotherapists', { body: physiotherapistsList });

      res.send({ data: { physiotherapists: physiotherapistsList } });
    } catch (err) {
      console.log(err);
      res.send({ data: 'There was an error with the request!' })
    }
  });
});

exports.setUserAsAdmin = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      functions.logger.info("Email", { body: req.body.data.email });

      const user = await admin.auth().getUserByEmail(req.body.data.email);
      await admin.auth().setCustomUserClaims(user.uid, { role: 'ADMIN' });

      res.send({ data: { message: 'Success! User promoted to Admin' } })
    } catch (err) {
      console.log(err);
      res.send({ data: 'There was an error with the request!' })
    }
  });
});

exports.setUserAsPhysiotherapist = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      functions.logger.info("Email", { body: req.body.data.email });

      const user = await admin.auth().getUserByEmail(req.body.data.email);
      await admin.auth().setCustomUserClaims(user.uid, { role: 'PHYSIOTHERAPIST' });

      res.send({ data: { message: 'Success! User promoted to Physiotherapst' } })
    } catch (err) {
      console.log(err);
      res.send({ data: 'There was an error with the request!' })
    }
  });
});

exports.setUserAsPatient = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      functions.logger.info("Email", { body: req.body.data.email });

      const user = await admin.auth().getUserByEmail(req.body.data.email);
      await admin.auth().setCustomUserClaims(user.uid, { role: 'PATIENT' });

      res.send({ data: { message: 'Success! User promoted to Patient' } })
    } catch (err) {
      console.log(err);
      res.send({ data: 'There was an error with the request!' })
    }
  });
});

exports.setDefaultRole = functions.auth.user().onCreate(async (user) => {
  try {
    functions.logger.info("User Email", { email: user.email });

    const userData = {
      userId: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      role: null,
    }

    const isAdmin = user.email.endsWith('@port.ac.uk');
    const physiotherapist = user.email.endsWith('@myport.ac.uk');

    if (isAdmin) { userData.role = 'ADMIN'; }
    else if (physiotherapist) { userData.role = 'PHYSIOTHERAPIST'; userData.specialisation = [] }
    else { userData.role = 'PATIENT'; userData.requestsList = [] }

    const dbCollection = userData.role + 'S';
    
    functions.logger.info("User Info", { admin: isAdmin, userData: userData });
    functions.logger.info("Collection", { dbCollection: dbCollection });
    
    await db.collection(dbCollection).doc(user.uid).set(userData);
    functions.logger.info("TEST1", { message: 'TEST1', role: userData.role });
    await admin.auth().setCustomUserClaims(user.uid, { role: userData.role })
    functions.logger.info("TEST2", { message: 'TEST2' });
    

    const userRecord = await admin.auth().getUser(user.uid);
    functions.logger.info("User Created", { role: userRecord.customClaims.role });
  
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
});
