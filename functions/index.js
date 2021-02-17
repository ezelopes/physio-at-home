const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors =  require('cors')({ origin: true });

const useEmulator = true;

if (useEmulator){
    process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8081';
    process.env['FIREBASE_AUTH_EMULATOR_HOST'] = 'localhost:9099';
}

admin.initializeApp({ projectId: 'physioathome-b2cdb' });
const db = admin.firestore();

exports.updatePhysioAccount = functions.region('europe-west1').https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { physioID, name, dob, height, weight, specialisations } = req.body.data;
      const dobFormatted = admin.firestore.Timestamp.fromDate(new Date(dob));
      
      await db.collection('PHYSIOTHERAPISTS').doc(physioID).update({ 
        name: name,
        dob: dobFormatted,
        height: height,
        weight: weight,
        specialisations: specialisations,
        activated: true
      })
      await admin.auth().setCustomUserClaims(physioID, { activated: true });

      console.log('Account Updated successfully');

      res.status(200).send({ data: { message: 'Account Updated Successfully!' } });
    } catch (err) {
      console.log(err);
      res.status(500).send({ data: 'There was an error with the request!' })
    }
  })
})

exports.updatePatientAccount = functions.region('europe-west1').https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { patientID, name, dob, height, weight } = req.body.data;
      const dobFormatted = admin.firestore.Timestamp.fromDate(new Date(dob));
      
      const firestoreResponse = await db.collection('PATIENTS').doc(patientID).update({ 
        name: name,
        dob: dobFormatted,
        height: height,
        weight: weight,
        activated: true
      })
      const claimsResponse = await admin.auth().setCustomUserClaims(patientID, { activated: true });

      console.log(claimsResponse);
      console.log(firestoreResponse);
      console.log('Account Updated successfully');

      res.status(200).send({ data: { message: 'Account Updated Successfully!' } });
    } catch (err) {
      console.log(err);
      res.status(500).send({ data: 'There was an error with the request!' })
    }
  })
})

exports.deleteSymptomOfPatient = functions.region('europe-west1').https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { patientID, symptomID } = req.body.data;

      await db.collection('PATIENTS').doc(patientID).collection('SYMPTOMS').doc(symptomID).delete();

      console.log('Symptom deleted successfully');

      res.status(200).send({ data: { message: 'Symptom Deleted Successfully!' } });
    } catch (err) {
      console.log(err);
      res.status(500).send({ data: 'There was an error with the request!' })
    }
  })
})

exports.addFeebackToSymptom = functions.region('europe-west1').https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { patientID, symptomID, feedbackObject } = req.body.data;
      // feedbackObject -> { doctorID, doctorName, feedbackContent, dateCreated }
      feedbackObject.dateCreated = admin.firestore.Timestamp.now();

      await db.collection('PATIENTS').doc(patientID).collection('SYMPTOMS').doc(symptomID).update({ 
        feedbackList: admin.firestore.FieldValue.arrayUnion(feedbackObject),
      })

      console.log('Feedback added successfully');

      res.status(200).send({ data: { message: 'Feedback Added Successfully!' } });
    } catch (err) {
      console.log(err);
      res.status(500).send({ data: 'There was an error with the request!' })
    }
  })
})

exports.getAllSymptomsFromPatient = functions.region('europe-west1').https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { patientID } = req.body.data;
      const symptomList = {};
      
      const symptomsDoc = await db.collection('PATIENTS').doc(patientID).collection('SYMPTOMS').get();
      symptomsDoc.forEach((currentSymptom) => {
        const currentSymptomInfo = currentSymptom.data();
        symptomList[currentSymptom.id] = currentSymptomInfo; 
      })

      console.log(symptomList);

      res.status(200).send({ data: { symptomList } });
    } catch (err) {
      console.log(err);
      res.status(500).send({ data: 'There was an error with the request!' })
    }
  })
})

exports.addNewPatientSymptom = functions.region('europe-west1').https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { patientID, symptomTitle, painRangeValue, bodyPart, symptomDetails, rangeOfMotion } = req.body.data;
      const feedbackList = [];
      const creationDate = admin.firestore.Timestamp.fromDate(new Date());
      console.log(patientID, symptomTitle, painRangeValue, bodyPart.rightOrLeft, bodyPart.bodyPart, bodyPart.specificBodyPart, symptomDetails, rangeOfMotion);

      await db.collection('PATIENTS').doc(patientID).collection('SYMPTOMS').doc().set({ creationDate, symptomTitle, painRangeValue, bodyPart, symptomDetails, rangeOfMotion, feedbackList })

      console.log('Symptom Added Successfully!');
      res.status(200).send({ data: { message: 'Symptom Added Successfully!' } });
    } catch (err) {
      console.log(err);
      res.status(500).send({ data: 'There was an error with the request!' })
    }
  });
});

exports.removeConnection = functions.region('europe-west1').https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { physioID, patientID } = req.body.data;
      console.log(physioID, patientID)

      await db.collection('PATIENTS').doc(patientID).update({ physiotherapistsList: admin.firestore.FieldValue.arrayRemove(physioID) })
      await db.collection('PHYSIOTHERAPISTS').doc(physioID).collection('PATIENTS').doc(patientID).delete(); 

      console.log('Connection removed successfully!');
      res.status(200).send({ data: { message: 'Connection removed successfully!' } });
    } catch (err) {
      console.log(err);
      res.status(500).send({ data: 'There was an error with the request!' })
    }
  });
});

exports.declineInviteRequest = functions.region('europe-west1').https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { physioID, patientID } = req.body.data;
      console.log(physioID, patientID)

      // REMOVE PHYSIO ID FROM PATIENT REQUESTSLIST FIELD
      await db.collection('PATIENTS').doc(patientID).update({ requestsList: admin.firestore.FieldValue.arrayRemove(physioID) })
      await db.collection('PHYSIOTHERAPISTS').doc(physioID).collection('INVITES').doc(patientID).delete();

      console.log('Declined successfully!');
      res.status(200).send({ data: { message: 'Patient Declined!' } });
    } catch (err) {
      console.log(err);
      res.status(500).send({ data: 'There was an error with the request!' })
    }
  });
});

exports.acceptInviteRequest = functions.region('europe-west1').https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      // Add height and weight.
      const { physioID, patientID, name, email, photoURL } = req.body.data;
      console.log(physioID, patientID, name, email, photoURL)

      // REMOVE PHYSIO ID FROM PATIENT REQUESTSLIST FIELD AND ADD IT TO physiotherapistsList
      
      await db.collection('PATIENTS').doc(patientID).update({ 
        physiotherapistsList: admin.firestore.FieldValue.arrayUnion(physioID),
        requestsList: admin.firestore.FieldValue.arrayRemove(physioID)
      })
      await db.collection('PHYSIOTHERAPISTS').doc(physioID).collection('PATIENTS').doc(patientID).set({ name, email, photoURL });
      await db.collection('PHYSIOTHERAPISTS').doc(physioID).collection('INVITES').doc(patientID).delete();

      console.log('Accepted successfully!');
      res.status(200).send({ data: { message: 'Patient Added!' } });
    } catch (err) {
      console.log(err);
      res.status(500).send({ data: 'There was an error with the request!' })
    }
  });
});

exports.getAllPhysioInvites =  functions.region('europe-west1').https.onRequest(async (req, res) => {
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

      res.status(200).send({ data: { invitesList } });
    } catch (err) {
      console.log(err);
      res.status(500).send({ data: 'There was an error with the request!' })
    }
  });
});

exports.getAllPhysioPatients = functions.region('europe-west1').https.onRequest(async (req, res) => {
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

      res.status(200).send({ data: { patientsList } });
    } catch (err) {
      console.log(err);
      res.status(500).send({ data: 'There was an error with the request!' })
    }
  });
});

exports.sendInvite = functions.region('europe-west1').https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      functions.logger.info("Req Body", { body: req.body.data });
      
      // Add height and weight
      const { physioID, patientID, patientEmail, patientName, photoURL } = req.body.data;
      
      await db.collection('PHYSIOTHERAPISTS').doc(physioID).collection('INVITES').doc(patientID).set({
        name: patientName,
        email: patientEmail,
        photoURL: photoURL
      })

      await db.collection('PATIENTS').doc(patientID).update({
        requestsList: admin.firestore.FieldValue.arrayUnion(physioID)
      })

      res.status(200).send({ data: { message: 'Request sent!' } })
    } catch (err) {
      console.log(err);
      res.status(500).send({ data: 'There was an error with the request!' })
    }
  });
});



exports.getPhysioData = functions.region('europe-west1').https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { physioID } = req.body.data;
      const physioDoc = await db.collection('PHYSIOTHERAPISTS').doc(physioID).get();
      
      let physioData = null;
      if (physioDoc.exists) physioData = physioDoc.data();

      res.status(200).send({ data: { physioData } });
    } catch (err) {
      console.log(err);
      res.status(500).send({ data: 'There was an error with the request!' })
    }
  });
});


exports.getPatientData = functions.region('europe-west1').https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { patientID } = req.body.data;
      const patientDoc = await db.collection('PATIENTS').doc(patientID).get();
      
      let patientData = null;
      if (patientDoc.exists) patientData = patientDoc.data();

      functions.logger.info('Patient Data', { body: patientData });

      res.status(200).send({ data: { patientData } });
    } catch (err) {
      console.log(err);
      res.status(500).send({ data: 'There was an error with the request!' })
    }
  });
});

exports.getAllPhysiotherapists = functions.region('europe-west1').https.onRequest(async (req, res) => {
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

      res.status(200).send({ data: { physiotherapists: physiotherapistsList } });
    } catch (err) {
      console.log(err);
      res.status(500).send({ data: 'There was an error with the request!' })
    }
  });
});

exports.setUserAsAdmin = functions.region('europe-west1').https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      functions.logger.info("Email", { body: req.body.data.email });

      const user = await admin.auth().getUserByEmail(req.body.data.email);
      await admin.auth().setCustomUserClaims(user.uid, { role: 'ADMIN' });

      res.status(200).send({ data: { message: 'Success! User promoted to Admin' } })
    } catch (err) {
      console.log(err);
      res.status(500).send({ data: 'There was an error with the request!' })
    }
  });
});

exports.setUserAsPhysiotherapist = functions.region('europe-west1').https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      functions.logger.info("Email", { body: req.body.data.email });

      const user = await admin.auth().getUserByEmail(req.body.data.email);
      await admin.auth().setCustomUserClaims(user.uid, { role: 'PHYSIOTHERAPIST' });

      res.status(200).send({ data: { message: 'Success! User promoted to Physiotherapst' } })
    } catch (err) {
      console.log(err);
      res.status(500).send({ data: 'There was an error with the request!' })
    }
  });
});

exports.setUserAsPatient = functions.region('europe-west1').https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      functions.logger.info("Email", { body: req.body.data.email });

      const user = await admin.auth().getUserByEmail(req.body.data.email);
      await admin.auth().setCustomUserClaims(user.uid, { role: 'PATIENT' });

      res.status(200).send({ data: { message: 'Success! User promoted to Patient' } })
    } catch (err) {
      console.log(err);
      res.status(500).send({ data: 'There was an error with the request!' })
    }
  });
});

exports.setDefaultRole = functions.region('europe-west1').auth.user().onCreate(async (user) => {
  try {
    functions.logger.info("User Email", { email: user.email });

    const userData = {
      userId: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      dob: new Date('1/1/1900'),
      height: 0,
      weight: 0,
      role: null,
      activated: false
    }

    const isAdmin = user.email.endsWith('@port.ac.uk'); // @physioathome.admin.com
    const physiotherapist = user.email.endsWith('@myport.ac.uk'); // @physioathome.therapist.com

    if (isAdmin) { userData.role = 'ADMIN'; }
    else if (physiotherapist) { userData.role = 'PHYSIOTHERAPIST'; userData.specialisations = [] }
    else { userData.role = 'PATIENT'; userData.requestsList = [], userData.physiotherapistsList = [] }

    const dbCollection = userData.role + 'S';
    
    functions.logger.info("User Info", { admin: isAdmin, userData: userData });
    functions.logger.info("Collection", { dbCollection: dbCollection });
    
    await admin.auth().createUser({ uid: user.uid });
    await admin.auth().setCustomUserClaims(user.uid, { role: userData.role, activated: false })
    await db.collection(dbCollection).doc(user.uid).set(userData);

    const userRecord = await admin.auth().getUser(user.uid);
    functions.logger.info("User Created", { role: userRecord.customClaims.role });
  
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
});
