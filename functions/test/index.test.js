const admin = require('firebase-admin');
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

const test = require('firebase-functions-test')();
const sinon = require('sinon');
const assert = require('assert')
// const jest = require('jest');

const myFunctions = require('../index');

describe('Physio At Home App - Field Validation Testing', () => {
  let configStub, adminInitStub, firestoreStub, fromDateStub;

  before(() => {
    const refStub = sinon.stub();
    setStub = sinon.stub();
    refStub.withArgs('xxx/yyy').returns({push: () => ({key: 'fakeKey', set: setStub})});

    adminInitStub = sinon.stub(admin, 'initializeApp');
    configStub = sinon.stub(functions, 'config').returns({ firebase: { databaseURL: 'https://not-a-project.firebaseio.com', storageBucket: 'not-a-project.appspot.com' } });

    firestoreStub = sinon.stub(admin, 'firestore').get(() => { return () => { return "data"; } });
    fromDateStub = sinon.stub(admin.firestore.Timestamp, 'fromDate').resolves(new Date())
    // sinon.stub(admin.firestore.Timestamp, 'fromDate').returns({ ref: refStub }); // .resolves(new Date('1995-01-01')); // admin.firestore.Timestamp.fromDate(new Date(dob));
  });

  after(() => {
    configStub.restore();
    adminInitStub.restore();
  });

  xit('Should update patient info as data is valid', async () => {

    const mockReq = { headers: { origin: true }, body: { data: {
      patientID: 'testPatientId', 
      name: 'Test Name', 
      dob: '1995-01-01',
      height: '180',
      weight: '60'
    } } };
    const mockRes = {
      send: () => { sinon.stub().returns(true) },
      status: () => { sinon.stub().returns(true) },
      setHeader: (key, value) => {},
      getHeader: (value) => {},
    };

    await myFunctions.updatePatientAccount(mockReq, mockRes);
    // const wrapped = test.wrap(myFunctions.updatePatientAccount)
    // await wrapped(mockReq, mockRes)

    // Verify behavior of tested function
    assert.ok(mockRes.status.calledOnce); // call with 500
  }); 

  xit('Should add feedback to symptom as data is valid', async () => {

    const mockReq = { headers: { origin: true }, body: { data: {
      patientID: 'testPatientID', symptomID: 'testSymptomID', feedbackObject: { feedbackContent: 'testContent' }
    } } };
    const mockRes = {
      send: () => { sinon.stub().returns(true) },
      status: () => { sinon.stub().returns(true) },
      setHeader: (key, value) => {},
      getHeader: (value) => {},
    };

    await myFunctions.addFeebackToSymptom(mockReq, mockRes);
    // const wrapped = test.wrap(myFunctions.updatePatientAccount)
    // await wrapped(mockReq, mockRes)

    // Verify behavior of tested function
    assert.ok(mockRes.status.calledOnce); // call with 500
  });

})