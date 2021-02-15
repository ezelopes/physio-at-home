import React, { memo, useRef, useState } from 'react';
import { Button, FormCheck } from 'react-bootstrap'
import { toast } from 'react-toastify';
import socketIOClient from "socket.io-client";

import toastConfig from '../../config/toast.config';

let socket = null;
let minAngle = 180;
let maxAngle = 0;

const StepThree = ({ selectedBodyPart, rightOrLeft, prevStep, nextStep, setMinAngle, setMaxAngle }) => {

  const ENDPOINT = "http://127.0.0.1:8069";
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];
  const [recording, setRecording] = useState(false);
  const [paralised, setParalised] = useState(false);

  const canvasRef = useRef(null);

  const startRecording = () => {
    try {
      setRecording(true);
      socket = socketIOClient(ENDPOINT);
      socket.on('connect_error', function(){
        toast.error('😔 Connection Failed - Server might be down or Kinect disconnected!', toastConfig);
        socket.disconnect()
      });
      socket.on('connect', () => { toast.success('📹 Recording started, make sure you move the highlighted body part!', toastConfig); })
      socket.on("bodyFrame", (resBodyFrame) => {
        interpretData(resBodyFrame, canvasRef.current.getContext('2d'))
       }
      );
    } catch (err) {
      toast.error('😔 There was an error with the Kinect Connection!', toastConfig);
    }
  }

  const distanceBetweenTwoJoints = (firstJoint, secondJoint) => {
    return Math.sqrt(
      Math.pow((secondJoint.colorX * 1920 - firstJoint.colorX * 1920), 2) + 
      Math.pow((secondJoint.colorY * 1080 - firstJoint.colorY * 1080), 2)
    );
  }

  const calculateAngleOfMotion = (a, b, c) => {
    return Math.acos(
      (
        Math.pow(a, 2) +
        Math.pow(b, 2) -
        Math.pow(c, 2)
      ) / (
        2*a*b
      )
    ) * (180 / Math.PI);
  }

  const calculateElbowAngle = (shoulderJoint, elbowJoint, wristJoint) => {
    const humerus = distanceBetweenTwoJoints(shoulderJoint, elbowJoint);
    const ulna = distanceBetweenTwoJoints(elbowJoint, wristJoint);
    const shoulderToWrist = distanceBetweenTwoJoints(shoulderJoint, wristJoint);

    const elbowAngle = calculateAngleOfMotion(humerus, ulna, shoulderToWrist);

    if (elbowAngle < minAngle) minAngle = elbowAngle;
    if (elbowAngle > maxAngle) maxAngle = elbowAngle;
  }
  
  const calculateKneeAngle = (hipJoint, kneeJoint, ankleJoint) => {
    const femur = distanceBetweenTwoJoints(hipJoint, kneeJoint);
    const tibia = distanceBetweenTwoJoints(kneeJoint, ankleJoint);
    const hipToAnkle = distanceBetweenTwoJoints(hipJoint, ankleJoint);

    const kneeAngle = calculateAngleOfMotion(femur, tibia, hipToAnkle);

    if (kneeAngle < minAngle) minAngle = kneeAngle;
    if (kneeAngle > maxAngle) maxAngle = kneeAngle;
  }

  const drawJoint = (ctx, joint, color) => {
    ctx.fillStyle = color ? color : colors[1];
    ctx.beginPath();
    ctx.arc(joint.colorX * 1920, joint.colorY * 1080, 10, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  }

  const interpretData = (bodyFrame, ctx) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    for (let i = 0; i < bodyFrame.bodies.length; i++) {
      if (bodyFrame.bodies[i].tracked === true) {
        const joints = bodyFrame.bodies[i].joints;

        if (selectedBodyPart === 'ELBOW' && rightOrLeft === 'LEFT') calculateElbowAngle(joints[4], joints[5], joints[6]); // left shoulder, elbow, wrist
        else if (selectedBodyPart === 'ELBOW' && rightOrLeft === 'RIGHT') calculateElbowAngle(joints[8], joints[9], joints[10]); // right shoulder, elbow, wrist
        else if (selectedBodyPart === 'KNEE' && rightOrLeft === 'LEFT') calculateKneeAngle(joints[12], joints[13], joints[14]); // left hip, knee, ankle
        else if (selectedBodyPart === 'KNEE' && rightOrLeft === 'RIGHT') calculateKneeAngle(joints[16], joints[17], joints[18]); // right hip, knee, ankle

        for (let j = 0; j < joints.length; j++) {
          const joint = joints[j];
          drawJoint(ctx, joint)
          
          if (selectedBodyPart === 'ELBOW') {
            if (rightOrLeft === 'LEFT' && (j === 4 || j === 5 || j === 6)) { drawJoint(ctx, joint, colors[0]) }
            if (rightOrLeft === 'RIGHT' && (j === 8 || j === 9 || j === 10)) { drawJoint(ctx, joint, colors[0]) }
          }
          
          else if (selectedBodyPart === 'KNEE') {
            if (rightOrLeft === 'LEFT' && (j === 12 || j === 13 || j === 14)) { drawJoint(ctx, joint, colors[0]) }
            if (rightOrLeft === 'RIGHT' && (j === 16 || j === 17 || j === 18)) { drawJoint(ctx, joint, colors[0]) }
          }
        }
      }
    }
  }

  const stopRecording = () => {
    setRecording(false);
    toast.success('🚀 Data captured successfully!', toastConfig);
    setMinAngle(minAngle.toFixed(2));
    setMaxAngle(maxAngle.toFixed(2));
    socket.disconnect();
  }

  return (
    <>
      <FormCheck className='first-element'>
        <FormCheck.Label> 
          <FormCheck.Input 
            type='checkbox' 
            onChange={() => {
              if (!paralised) { setParalised(true); setMinAngle(180); setMaxAngle(180); }
              else { setParalised(false); setMinAngle(180); setMaxAngle(0); }
            }}
          />
          Tick if you are not able to move the selected extremity
        </FormCheck.Label>
      </FormCheck>

      <Button variant="primary" type="button" className='left-button first-element' onClick={() => startRecording()} disabled={recording || paralised}>
        <span role="img" aria-label="back"> Record Video 📹 </span>
      </Button>

      <Button variant="primary" type="button" className='first-element' onClick={() => stopRecording()} disabled={!recording || paralised}>
      <span role="img" aria-label="back"> Stop Video 🛑 </span>
      </Button>

      <div id='form-kinect-wrapper'>
        <canvas id="canvasKinect" width="1920" height="1080" ref={canvasRef} className="img-fluid"></canvas>
      </div>

      <Button
        type="submit"
        className='form-button left-button'
        onClick={(e) => { e.preventDefault(); prevStep(); }}
      >
        Back
      </Button>

      <Button 
        id='addNewSymptomButton'
        variant="success"
        type="submit"
        className='form-button'
        onClick={(e) => { e.preventDefault(); nextStep(); }}
      >
        Next
      </Button>
    </>
  );
}

export default memo(StepThree);