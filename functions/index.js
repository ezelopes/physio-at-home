const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors =  require('cors')({ origin: true });

admin.initializeApp();
const db = admin.firestore();

exports.sendConnectionRequest = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      functions.logger.info("Req Body", { body: req.body.data });
      
      const { physioID, patientID, patientEmail, patientName } = req.body.data;
      
      await db.collection('physiotherapists').doc(physioID).collection('patients').doc(patientID).set({
        name: patientName,
        email: patientEmail,
        status: 'PENDING',
      })

      await db.collection('patients').doc(patientID).update({
        requestsList: admin.firestore.FieldValue.arrayUnion(physioID)
      })

      res.send({ data: { message: 'Request sent!' } })
    } catch (err) {
      functions.logger.info("Error", { body: err });
      res.send({ data: 'There was an error with the request!' })
    }
  });
});

exports.getPatientData = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const patientDoc = await db.collection('patients').doc(req.body.data.patientID).get();
      
      let patientData = null;
      if (patientDoc.exists) patientData = patientDoc.data();

      functions.logger.info('Patient Data', { body: patientData });

      res.send({ data: { patientData } });
    } catch (err) {
      functions.logger.info("Error", { body: err });
      res.send({ data: 'There was an error with the request!' })
    }
  });
});

exports.getAllPhysiotherapists = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const physiotherapistsList = [];
      const physiotherapists = await db.collection('physiotherapists').get();

      physiotherapists.forEach((currentPhysiotherapist) => {
        const currentPhysiotherapistInfo = currentPhysiotherapist.data();
        currentPhysiotherapistInfo.id = currentPhysiotherapist.id;
        physiotherapistsList.push(currentPhysiotherapistInfo);
        functions.logger.info('Current Physiotherapists', { id: currentPhysiotherapist.id, body: currentPhysiotherapist.data() });
      });


      functions.logger.info('Retrieved Physiotherapists', { body: physiotherapistsList });

      res.send({ data: { physiotherapists: physiotherapistsList } });
    } catch (err) {
      functions.logger.info("Error", { body: err });
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
      functions.logger.info("Error", { body: err });
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
      functions.logger.info("Error", { body: err });
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
      functions.logger.info("Error", { body: err });
      res.send({ data: 'There was an error with the request!' })
    }
  });
});

exports.setDefaultRole = functions.auth.user().onCreate(async (user) => {
  try {
    const defaultRole = 'PATIENT';

    await admin.auth().setCustomUserClaims(user.uid,{ role: defaultRole })

    await db.collection('patients').doc(user.uid).set({
      userId: user.uid,
      email: user.email,
      name: user.displayName,
      role: defaultRole,
      requestsList: [],
    });
  
    const userRecord = await admin.auth().getUser(user.uid);
    functions.logger.info("User Created", {
      email: user.email,
      role: userRecord.customClaims.role
    });
  
    return null;
  } catch (err) {
    functions.logger.info("Error", { body: err });
    return null;
  }
});
