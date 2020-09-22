const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors =  require('cors')({ origin: true });

admin.initializeApp();
const db = admin.firestore();

exports.getAllPhysiotherapists = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const physiotherapistsList = [];
      const physiotherapists = await db.collection('physiotherapists').get();

      physiotherapists.forEach((currentPhysiotherapist) => {
        const currentPhysiotherapistInfo = currentPhysiotherapist.data();
        physiotherapistsList.push(currentPhysiotherapistInfo);
        functions.logger.info('Current Physiotherapists', { id: currentPhysiotherapist.id, body: currentPhysiotherapist.data() });
      });


      functions.logger.info('Retrieved Physiotherapists', { body: physiotherapistsList });

      res.send({ data: { physiotherapists: physiotherapistsList } });
    } catch (err) {
      res.send({ data: err })
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
      res.send({ data: err })
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
      res.send({ data: err })
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
      res.send({ data: err })
    }
  });
});

exports.setDefaultRole = functions.auth.user().onCreate(async (user) => {

  try {
    await admin.auth().setCustomUserClaims(user.uid,{ role: 'PATIENT' })

    await db.collection('users').doc(user.email).set({
      userId: user.uid,
      email: user.email,
      name: user.displayName,
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
