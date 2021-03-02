require('dotenv').config()
const assert = require('assert');
const firebase = require('@firebase/testing');

const MY_PROJECT_ID = process.env.PROJECT_ID;

const adminAuth = { uid: 'adminID', email: 'admin@admin.co.uk', role: 'ADMIN' };
const physiotherpistAuth = { uid: 'physiotherapistID', email: 'physiotherpist@physiotherpist.co.uk', role: 'PHYSIOTHERAPIST' };
const patientAuth = { uid: 'patientID', email: 'patient@patient.co.uk', role: 'PATIENT' };

const mockPatient = { 
  userId: 'patientID',
  email: 'patient@patient.co.uk',
  name: 'Patient Name',
  physiotherapistsList: [],
  requestsList: [],
  dob: new Date('1/1/1999'),
  height: 180,
  weight: 60
}

const mockPhysiotherapist = {
  userId: 'physiotherapistID',
  email: 'physiotherapist@physiotherapist.co.uk',
  name: 'Physiotherapist Name',
  dob: new Date('1/1/1990'),
  height: 180,
  weight: 60
}

const mockSymptom = {
  bodyPart: {},
  creationDate: new Date(),
  feedbackList: [],
  painRangeValue: 0,
  rangeOfMotion: {},
  symptomDetails: '',
  symptomTitle: ''
}

const getFirestore = async (auth) => {
  return firebase
    .initializeTestApp({ projectId: MY_PROJECT_ID, auth: auth })
    .firestore();
}

function getAdminFirestore() {
  return firebase.initializeAdminApp({ projectId: MY_PROJECT_ID }).firestore();
}

describe('Physio At Home App', () => {

  // eslint-disable-next-line no-undef
  after(() => {
    Promise.all(firebase.apps().map(app => app.delete()))
  })

  beforeEach(async () => {
    await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
  });

  afterEach(async () => {
    await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID })
  })

  describe('Admin Tests', () => {

    // reading an admin is only possible if authed user is also admin

    it('should pass as Admins can read all items', async () => {
      const db = await getFirestore(adminAuth);
      const testAdminsDoc = db.collection('ADMINS').doc('adminID');
      await firebase.assertSucceeds(testAdminsDoc.get());
    })
  
    it('should pass as Admins can update Patients` name, dob, height, weight, requestsList, physiotherapistsList', async () => { // Not really
      const admin = getAdminFirestore();
      const setupDoc = admin.collection('PATIENTS').doc('patientID');
      await setupDoc.set(mockPatient);
  
      const db = await getFirestore(adminAuth);
      const testPatientsDoc = db.collection('PATIENTS').doc('patientID');
      await firebase.assertSucceeds(testPatientsDoc.update({ 
        name: 'Updated Patient Name',
        physiotherapistsList: ['UpdatedArrayValue'],
        requestsList: ['UpdatedArrayValue'],
        dob: new Date('1/1/2000'),
        height: 200,
        weight: 80
      }))
    })
  
    it('should fail as Admins can only update Patients` name, dob, height, weight, requestsList, physiotherapistsList', async () => { // Not really
      const admin = getAdminFirestore();
      const setupDoc = admin.collection('PATIENTS').doc('patientID');
      await setupDoc.set(mockPatient);
  
       const db = await getFirestore(adminAuth);
      const testPatientsDoc = db.collection('PATIENTS').doc('patientID');
      await firebase.assertFails(testPatientsDoc.update({ 
        userId: '',
        email: ''
      }))
    })
    
    it('should pass as Admins can update Physiotherapists` name, dob, height, weight', async () => {
      const admin = getAdminFirestore();
      const setupDoc = admin.collection('PHYSIOTHERAPISTS').doc('physiotherapistID');
      await setupDoc.set(mockPhysiotherapist);
  
       const db = await getFirestore(adminAuth);
      const testPhysiotherapistsDoc = db.collection('PHYSIOTHERAPISTS').doc('physiotherapistID');
      await firebase.assertSucceeds(testPhysiotherapistsDoc.update({ 
        name: 'Updated Patient Name',
        dob: new Date('1/1/2000'),
        height: 200,
        weight: 80
      }))
    })
    
    it('should fail as Admins can only update Physiotherapists` name, dob, height, weight', async () => {
      const admin = getAdminFirestore();
      const setupDoc = admin.collection('PHYSIOTHERAPISTS').doc('physiotherapistID');
      await setupDoc.set(mockPhysiotherapist);
  
       const db = await getFirestore(adminAuth);
      const testPhysiotherapistsDoc = db.collection('PHYSIOTHERAPISTS').doc('physiotherapistID');
      await firebase.assertFails(testPhysiotherapistsDoc.update({ 
        userId: '',
        email: ''
      }))
    })
  
  })

  describe('Physiotherapist Tests', () => {

    it('should pass as Physiotherapists can update feedbackList within Patients subcollection Symptoms', async () => {
      const admin = getAdminFirestore();
      const setupDoc = admin.collection('PATIENTS').doc('patientID');
      await setupDoc.set(mockPatient);
      await setupDoc.collection('SYMPTOMS').doc('symptomID').set(mockSymptom);

      const db = await getFirestore(physiotherpistAuth);
      const testSymptomDoc = db.collection('PATIENTS').doc('patientID').collection('SYMPTOMS').doc('symptomID');
      await firebase.assertSucceeds(testSymptomDoc.update({ 
        feedbackList: [{ dateCreated: new Date(), feedbackContent: '', physioID: physiotherpistAuth.uid, physioName: physiotherpistAuth.email }],
      }))
    })
    
    it('should fail as Physiotherapists can only update feedbackList within Patients subcollection Symptoms', async () => {
      const admin = getAdminFirestore();
      const setupDoc = admin.collection('PATIENTS').doc('patientID');
      await setupDoc.set(mockPatient);
      await setupDoc.collection('SYMPTOMS').doc('symptomID').set(mockSymptom);

      const db = await getFirestore(physiotherpistAuth);
      const testSymptomDoc = db.collection('PATIENTS').doc('patientID').collection('SYMPTOMS').doc('symptomID');
      await firebase.assertFails(testSymptomDoc.update({ painRangeValue: 100 }))
      await firebase.assertFails(testSymptomDoc.update({ bodyPart: 'updated' }))
      await firebase.assertFails(testSymptomDoc.update({ creationDate: new Date('1/1/2020') }))
      await firebase.assertFails(testSymptomDoc.update({ rangeOfMotion: 'updated' }))
      await firebase.assertFails(testSymptomDoc.update({ symptomDetails: 'updated' }))
      await firebase.assertFails(testSymptomDoc.update({ symptomTitle: 'updated' }))
    })

    it('should pass as Physiotherapists can only update Patients requestList and physiotherapistsList', async () => {

      const admin = getAdminFirestore();
      const setupDoc = admin.collection('PATIENTS').doc('patientID');
      await setupDoc.set(mockPatient);
  
      const db = await getFirestore(physiotherpistAuth);
      const testPatientsDoc = db.collection('PATIENTS').doc('patientID');
      await firebase.assertSucceeds(testPatientsDoc.update({ 
        physiotherapistsList: ['UpdatedArrayValue'],
        requestsList: ['UpdatedArrayValue']
      }))
    })
  
    it('should fail as Physiotherapists can only update Patients requestList and physiotherapistsList', async () => {
  
      const admin = getAdminFirestore();
      const setupDoc = admin.collection('PATIENTS').doc('patientID');
      await setupDoc.set(mockPatient);
  
      const db = await getFirestore(physiotherpistAuth);
      const testPatientsDoc = db.collection('PATIENTS').doc('patientID');
      await firebase.assertFails(testPatientsDoc.update({ 
        physiotherapistsList: ['UpdatedArrayValue'],
        requestsList: ['UpdatedArrayValue'],
        name: 'Updated Patient Name'
      }))
    })

    it('should fail as Physiotherapists cannot updated patients personal info within their Subcollection', async () => {
      const admin = getAdminFirestore();
      const setupDoc = admin.collection('PHYSIOTHERAPISTS').doc('physiotherapistID');
      await setupDoc.set(mockPhysiotherapist);
      await setupDoc.collection('PATIENTS').doc('patientID').set({ name: 'Patient Name', email: 'patient@patient.co.uk', photoURL: 'url', dob: new Date('1/1/1999'), height: 180, weight: 60 });

      const db = await getFirestore(physiotherpistAuth);
      const testPatientDoc = db.collection('PHYSIOTHERAPISTS').doc('physiotherapistID').collection('PATIENTS').doc('patientID');
      await firebase.assertFails(testPatientDoc.update({ 
        name: 'Updated Patient Name',
        email: 'updatedpatient@patient.co.uk',
        dob: new Date('1/1/2000'),
        height: 200,
        weight: 80
      }))
    })
  })

  describe('Patient Tests', () => {
    
    // reads can only be accomplish by same user, physiotherapists and admins

    it('should pass as Patients can update their own allowed info', async () => {
      const admin = getAdminFirestore();
      const setupDoc = admin.collection('PATIENTS').doc('patientID');
      await setupDoc.set(mockPatient);
  
      const db = await getFirestore(patientAuth);
      const testPatientsDoc = db.collection('PATIENTS').doc('patientID');
      await firebase.assertSucceeds(testPatientsDoc.update({
        name: 'Updated Patient Name',
        physiotherapistsList: ['UpdatedArrayValue'],
        requestsList: ['UpdatedArrayValue'],
        dob: new Date('1/1/2000'),
        height: 200,
        weight: 80
      }))
    })
    
    it('should fail as Patients cannot update their own id or email', async () => {
      const admin = getAdminFirestore();
      const setupDoc = admin.collection('PATIENTS').doc('patientID');
      await setupDoc.set(mockPatient);
  
      const db = await getFirestore(patientAuth);
      const testPatientsDoc = db.collection('PATIENTS').doc('patientID');
      await firebase.assertFails(testPatientsDoc.update({ userId: 'new' }))
      await firebase.assertFails(testPatientsDoc.update({ email: 'new email' }))
    })

    it('should fail as Patients cannot update other Patients info', async () => {
      const admin = getAdminFirestore();
      const setupDoc = admin.collection('PATIENTS').doc('other_patientID');
      await setupDoc.set(mockPatient);
  
      const db = await getFirestore(patientAuth);
      const testPatientsDoc = db.collection('PATIENTS').doc('other_patientID');
      await firebase.assertFails(testPatientsDoc.update({ 
        name: 'Updated Patient Name',
        physiotherapistsList: ['UpdatedArrayValue'],
        requestsList: ['UpdatedArrayValue'],
        dob: new Date('1/1/2000'),
        height: 200,
        weight: 80
      }))
    })

    it('should pass as Patients can update their info within Physiotherapy Subcollection', async () => {
      const admin = getAdminFirestore();
      const setupDoc = admin.collection('PHYSIOTHERAPISTS').doc('physiotherapistID');
      await setupDoc.set(mockPhysiotherapist);
      await setupDoc.collection('PATIENTS').doc('patientID').set({ name: 'Patient Name', email: 'patient@patient.co.uk', photoURL: 'url', dob: new Date('1/1/1999'), height: 180, weight: 60 });

      const db = await getFirestore(patientAuth);
      const testPatientDoc = db.collection('PHYSIOTHERAPISTS').doc('physiotherapistID').collection('PATIENTS').doc('patientID');
      await firebase.assertSucceeds(testPatientDoc.update({ 
        name: 'Updated Patient Name',
        email: 'updatedpatient@patient.co.uk',
        dob: new Date('1/1/2000'),
        height: 200,
        weight: 80
      }))
    })

    it('should fail as Patients cannot update other Patients info within Physiotherapy Subcollection', async () => {
      const admin = getAdminFirestore();
      const setupDoc = admin.collection('PHYSIOTHERAPISTS').doc('physiotherapistID');
      await setupDoc.set(mockPhysiotherapist);
      await setupDoc.collection('PATIENTS').doc('other_patientID').set({ name: 'Patient Name', email: 'patient@patient.co.uk', photoURL: 'url', dob: new Date('1/1/1999'), height: 180, weight: 60 });

      const db = await getFirestore(patientAuth);
      const testPatientDoc = db.collection('PHYSIOTHERAPISTS').doc('physiotherapistID').collection('PATIENTS').doc('other_patientID');
      await firebase.assertFails(testPatientDoc.update({ 
        name: 'Updated Patient Name',
        email: 'updatedpatient@patient.co.uk',
        dob: new Date('1/1/2000'),
        height: 200,
        weight: 80
      }))
    })

    it('should pass as Patients can delete themselves from within Physiotherapy Subcollection', async () => {
      const admin = getAdminFirestore();
      const setupDoc = admin.collection('PHYSIOTHERAPISTS').doc('physiotherapistID');
      await setupDoc.set(mockPhysiotherapist);
      await setupDoc.collection('PATIENTS').doc('patientID').set({ name: 'Patient Name', email: 'patient@patient.co.uk', photoURL: 'url', dob: new Date('1/1/1999'), height: 180, weight: 60 });

      const db = await getFirestore(patientAuth);
      const testPatientDoc = db.collection('PHYSIOTHERAPISTS').doc('physiotherapistID').collection('PATIENTS').doc('patientID');
      await firebase.assertSucceeds(testPatientDoc.delete())
    })

    it('should pass as Patients can add themselves into Physiotherapy Subcollection Invites when sending a request', async () => {
      const admin = getAdminFirestore();
      const setupPhysioDoc = admin.collection('PHYSIOTHERAPISTS').doc('physiotherapistID');
      await setupPhysioDoc.set(mockPhysiotherapist);
      const setupPatientDoc = admin.collection('PATIENTS').doc('patientID');
      await setupPatientDoc.set(mockPatient);

      const invitePath = '/PHYSIOTHERAPISTS/physiotherapistID/INVITES/patientID';

      const db = await getFirestore(patientAuth);
      const inviteDoc = db.doc(invitePath);
      await firebase.assertSucceeds(inviteDoc.set({ name: mockPatient.name, email: mockPatient.email, dob: mockPatient.dob, height: mockPatient.height, weight: mockPatient.weight }))
    })

    it('should fail as Patients cannot delete other patients from within Physiotherapy Subcollection', async () => {
      const admin = getAdminFirestore();
      const setupDoc = admin.collection('PHYSIOTHERAPISTS').doc('physiotherapistID');
      await setupDoc.set(mockPhysiotherapist);
      await setupDoc.collection('PATIENTS').doc('other_patientID').set({ name: 'Patient Name', email: 'patient@patient.co.uk', photoURL: 'url', dob: new Date('1/1/1999'), height: 180, weight: 60 });

      const db = await getFirestore(patientAuth);
      const testPatientDoc = db.collection('PHYSIOTHERAPISTS').doc('physiotherapistID').collection('PATIENTS').doc('other_patientID');
      await firebase.assertFails(testPatientDoc.delete())
    })

    it('should pass as Patients can upload symptoms', async () => {
      const admin = getAdminFirestore();
      const setupDoc = admin.collection('PATIENTS').doc('patientID');
      await setupDoc.set(mockPatient);

      const symptomPath = '/PATIENTS/patientID/SYMPTOMS/symptomID';

      const db = await getFirestore(patientAuth);
      const symptomDoc = db.doc(symptomPath);
      await firebase.assertSucceeds(symptomDoc.set(mockSymptom))
    })
    
    it('should fail as Patients can upload symptoms only on their behalves', async () => {
      const admin = getAdminFirestore();
      const setupDoc = admin.collection('PATIENTS').doc('other_patientID');
      await setupDoc.set(mockPatient);

      const symptomPath = '/PATIENTS/other_patientID/SYMPTOMS/symptomID';

      const db = await getFirestore(patientAuth);
      const symptomDoc = db.doc(symptomPath);
      await firebase.assertFails(symptomDoc.set(mockSymptom))
    })

  })

})

