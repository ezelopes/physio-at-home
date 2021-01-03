const Kinect2 = require('kinect2');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const kinect = new Kinect2();

if (kinect.open()) {
  try {
    server.listen(8069, () => { console.log('Kinect opened. Server listening on port 8000') });
    
    io.on('connection', (socket) => {
      console.log('SOMEONE CONNECTED')
  
      kinect.on('bodyFrame', (bodyFrame) => {
        socket.emit('bodyFrame', bodyFrame);
      });
    });
  
    kinect.openBodyReader();
  } catch (err) {
    const message = 'KINECT IS NOT CONNECTED. SERVER WILL NOT WORK WITHOUT A FUNCTIONAL KINECT';
    io.sockets.emit('error', { message })
  }
 
} else {
  const message = 'KINECT IS NOT CONNECTED. SERVER WILL NOT WORK WITHOUT A FUNCTIONAL KINECT';
  console.log(message);
  io.sockets.emit('error', { message })
}