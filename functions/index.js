const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors =  require('cors')({ origin: true });

admin.initializeApp();
const db = admin.firestore();

// exports.temp = functions.region('europe-west1').https.onCall(async (req, res) => {});

exports.getAllPhysioPatients = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      functions.logger.info("Req Body", { body: req.body.data });
      const pendingPatientsList = [];
      const patientsList = [];
      const { physioID } = req.body.data;
      
      const patientsDoc = await db.collection('PHYSIOTHERAPISTS').doc(physioID).collection('PATIENTS').get();
      
      patientsDoc.forEach((currentPatient) => {
        const currentPatientInfo = currentPatient.data();
        currentPatientInfo.id = currentPatient.id;
        console.log('TEEEEST');
        console.log(currentPatientInfo);
        if (currentPatientInfo.status === 'PENDING') pendingPatientsList.push(currentPatientInfo);
        else if (currentPatientInfo.status === 'ACCEPTED') patientsList.push(currentPatientInfo);
      })

      functions.logger.info('Patients Of Physio', { body: patientsList });

      res.send({ data: { pendingPatientsList, patientsList } });
    } catch (err) {
      console.log(err);
      res.send({ data: 'There was an error with the request!' })
    }
  });
});

exports.sendConnectionRequest = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      functions.logger.info("Req Body", { body: req.body.data });
      
      const { physioID, patientID, patientEmail, patientName } = req.body.data;
      
      await db.collection('PHYSIOTHERAPISTS').doc(physioID).collection('PATIENTS').doc(patientID).set({
        name: patientName,
        email: patientEmail,
        status: 'PENDING',
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
