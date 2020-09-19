const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors =  require('cors')({ origin: true });

admin.initializeApp();

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

  await admin.auth().setCustomUserClaims(user.uid,{ role: 'PATIENT' })

  const userRecord = await admin.auth().getUser(user.uid);
  functions.logger.info("Role", { body: userRecord.customClaims.role });

  return null;
});
