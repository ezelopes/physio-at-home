import React, { useRef } from 'react';
import { Button, Form } from 'react-bootstrap'
import socketIOClient from "socket.io-client";

let socket = null;

const StepThree = ({ prevStep, nextStep, setMinRightAngle, setMaxRightAngle, setMinLeftAngle, setMaxLeftAngle }) => {

  let minRightAngle = 180;
  let maxRightAngle = 0;
  let minLeftAngle = 180;
  let maxLeftAngle = 0;

  const ENDPOINT = "http://127.0.0.1:8069";
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];

  const canvasRef = useRef(null);

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

  const interpretData = (bodyFrame, ctx) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    for (let i = 0; i < bodyFrame.bodies.length; i++) {
      if (bodyFrame.bodies[i].tracked === true) {
        const joints = bodyFrame.bodies[i].joints;

        const rightHumerus = distanceBetweenTwoJoints(joints[8], joints[9]);
        const rightUlna = distanceBetweenTwoJoints(joints[9], joints[10]);
        const rightShoulderToWrist = distanceBetweenTwoJoints(joints[8], joints[10]);
        
        const leftHumerus = distanceBetweenTwoJoints(joints[4], joints[5]);
        const leftUlna = distanceBetweenTwoJoints(joints[5], joints[6]);
        const leftShoulderToWrist = distanceBetweenTwoJoints(joints[4], joints[6]);

        const rightElbowAngle = calculateAngleOfMotion(rightHumerus, rightUlna, rightShoulderToWrist);
        const leftElbowAngle = calculateAngleOfMotion(leftHumerus, leftUlna, leftShoulderToWrist);

        console.log('right', rightElbowAngle);
        if (rightElbowAngle < minRightAngle) minRightAngle = rightElbowAngle;
        if (rightElbowAngle > maxRightAngle) maxRightAngle = rightElbowAngle;
        
        console.log('left', leftElbowAngle);
        if (leftElbowAngle < minLeftAngle) minLeftAngle = leftElbowAngle;
        if (leftElbowAngle > maxLeftAngle) maxLeftAngle = leftElbowAngle;



        for (let j = 0; j < joints.length; j++) {
          const joint = joints[j];
          if (j === 4 || j === 5 || j === 6) {
            ctx.fillStyle = colors[0];
            ctx.beginPath();
            ctx.arc(joint.colorX * 1920, joint.colorY * 1080, 10, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
          } else if (j === 8 || j === 9 || j === 10) {
            ctx.fillStyle = colors[1];
            ctx.beginPath();
            ctx.arc(joint.colorX * 1920, joint.colorY * 1080, 10, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
          }
        }
      }
    }
  }

  const stopRecording = () => {
    alert(JSON.stringify({ minRightAngle, maxRightAngle, minLeftAngle, maxLeftAngle }))
    setMinRightAngle(minRightAngle);
    setMaxRightAngle(maxRightAngle);
    setMinLeftAngle(minLeftAngle);
    setMaxLeftAngle(maxLeftAngle);
    socket.disconnect();
  }

  return (
    <>
      <Form.Group style={{ marginTop: '2em' }}>
        <Button variant="primary" type="button" style={{ marginRight: '1em' }} onClick={() => startRecording()}>
          <span role="img" aria-label="back"> Record Video 📹 </span>
        </Button>

        <Button variant="primary" type="button" onClick={() => stopRecording()}>
        <span role="img" aria-label="back"> Stop Video 🛑 </span>
        </Button>
      </Form.Group>

      <div style={{color: 'white', border: 'solid', borderColor: '#0069D9' }}>
        <canvas id="canvasKinect" width="1920" height="1080" ref={canvasRef} className="img-fluid"></canvas>
      </div>

      <Button 
        id='addNewSymptomButton'
        // variant="warning"
        type="submit"
        style={{ marginTop: '2em', marginRight: '1em' }}
        onClick={(e) => { e.preventDefault(); prevStep(); }}
      >
        Back
      </Button>

      <Button 
        id='addNewSymptomButton'
        variant="success"
        type="submit"
        style={{ marginTop: '2em' }}
        onClick={(e) => { e.preventDefault(); nextStep(); }}
      >
        Next
      </Button>
    </>
  );
}

export default StepThree;