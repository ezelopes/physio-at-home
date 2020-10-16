import React, { useState, useRef } from 'react';
import { Button, Form } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';
import socketIOClient from "socket.io-client";

import firebase from '../../config/firebase.config';
import toastConfig from '../../config/toast.config';
import 'react-toastify/dist/ReactToastify.css';

import RangeBar from '../../components/rangeBar'
import KneeImage from '../../components/kneeImage'

const ENDPOINT = "http://127.0.0.1:8069";
const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];

const functions = firebase.functions();

const AddNewSymptomPage = () => {

  const canvasRef = useRef(null);
  let socket= null;

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const bodyPartsList = [ 'Knee', 'Shoulder', 'Back' ];

  const [selectedBodyPart, setBodyPart] = useState('Knee');
  const [specificBodyPart, setSpecificBodyPart] = useState('');

  const submitNewSymptom = async (e) => {
    e.preventDefault();

    document.getElementById('addNewSymptomButton').disabled = true;
    document.getElementById('addNewSymptomButton').textContent = 'Loading...';
    try {
      const symptomTitle = document.getElementById('symptomTitle').value;
      const painRangeValue = document.getElementById('painRangeID').value;
      const symptomDetails = document.getElementById('symptomDetails').value;
      console.log(painRangeValue, specificBodyPart, symptomDetails)
    
      const addNewPatientSymptom = functions.httpsCallable('addNewPatientSymptom');
      const response = await addNewPatientSymptom({ patientID: userInfo.uid, symptomTitle, painRangeValue, specificBodyPart, symptomDetails });
      console.log(response);
    
      toast.success('🚀 Symptom Added Successfully!', toastConfig);
    } catch(err) {
      toast.error('😔 There was an error adding your symptom!', toastConfig);
    }
      
    document.getElementById('addNewSymptomButton').disabled = false;
    document.getElementById('addNewSymptomButton').textContent = 'Submit';
  }

  const startRecording = () => {
    try {
      socket = socketIOClient(ENDPOINT);
      socket.on('connect_error', function(){
        console.log('Connection Failed - Server might be down or Kinect disconnected!');
        socket.disconnect()
      });
      socket.on('connect', () => { console.log('CONNECTED') })
      socket.on("bodyFrame", (resBodyFrame) => {
        interpretData(resBodyFrame, canvasRef.current.getContext('2d'))
       }
      );
    } catch (err) {
      console.log(err)
    }
  }

  const interpretData = (bodyFrame, ctx) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    for (let i = 0; i < bodyFrame.bodies.length; i++) {
      if (bodyFrame.bodies[i].tracked === true) {
        console.log('tracked');
        for (let j = 0; j < bodyFrame.bodies[i].joints.length; j++) {
          const joint = bodyFrame.bodies[i].joints[j];
          ctx.fillStyle = colors[i];
          ctx.beginPath();
          ctx.arc(joint.depthX * 400, joint.depthY * 400, 10, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
  }

  const stopRecording = () => {
    socket.disconnect();
  }

  const handleBodyPartChange = (e) => {
    const { value } = e.target;
    setBodyPart(value);
  }

  const renderSwitch = (bodyPart) => {
    switch(bodyPart.toUpperCase()) {
      case 'KNEE':
        return <KneeImage setSpecificBodyPart={setSpecificBodyPart} />;
      case 'SHOULDER':
        return 'SHOULDER IMG';
      case 'BACK':
        return 'BACK IMG';
      default:
        return null;
    }
  }
  return (
    <>
      <ToastContainer />
      <h2 style={{ marginBottom: '1em' }}> Add New Symptoms Here </h2>
      <Form style={{ width: '60%', margin: 'auto', border: 'solid', padding: '2em' }}>
      <Form.Group>
          <Form.Label>Symptom Title</Form.Label>
          <Form.Control type="text" placeholder="Insert here a title..." />
        </Form.Group>

        <Form.Group style={{ marginTop: '2em' }}>
          <Form.Label> Where do you feel pain? </Form.Label>
          <Form.Control
            placeholder='Choose...'
            as="select"
            className="my-1 mr-sm-2"
            id="bodyPartSelect"
            onChange={(e) => { handleBodyPartChange(e) }}
            custom
          >
            {bodyPartsList.map((currentBodyPart, index) => {
              return <option value={currentBodyPart} key={index}> {currentBodyPart} </option>
            })}
          </Form.Control>
          {/* IMG WITH BUTTONS - DEFAULT VISIBLE FALSE. CHANGE SRC BASED ON SELECTION */}
        </Form.Group>
          <div>{renderSwitch(selectedBodyPart)}</div>
          
        {/* <BodyImageComponent bodyPart={selectedBodyPart} /> */}

        <Form.Group style={{ marginTop: '2em' }}>
          <Form.Label>How much pain do you feel?</Form.Label>
          <RangeBar id="painRangeID" />
        </Form.Group>

        <Form.Group style={{ marginTop: '2em' }}>
          <Form.Label>Please insert more details</Form.Label>
          <Form.Control as='textarea' placeholder="Insert here details..." id='symptomDetails' />
        </Form.Group>

        <Form.Group style={{ marginTop: '2em' }}>
          <Button variant="primary" type="button" style={{ marginRight: '1em' }} onClick={() => startRecording()}>
            Record Video
          </Button>

          <Button variant="primary" type="button" onClick={() => stopRecording()}>
            Stop Video
          </Button>
        </Form.Group>

        <div style={{color: 'white', border: 'solid', borderColor: '#0069D9' }}>
          <canvas id="canvasKinect" width="512" height="640" ref={canvasRef} className="img-fluid"></canvas>
        </div>

        <Button 
          id='addNewSymptomButton'
          variant="success"
          type="submit"
          style={{ marginTop: '2em' }}
          onClick={(e) => submitNewSymptom(e)}
        >
          Submit
        </Button>
      </Form>
    </>
  );
}

export default AddNewSymptomPage;