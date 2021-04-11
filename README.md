# Physio At Home

This is a Final Year Project for my Computer Science degree at University of Portsmouth.
The Web Application consists of a platform prototype in which Patients and Physiotherapists can create an account and establish connections with each others.
Patients are allowed to upload symptoms - also using the Kinect V2 to collect more data - and Physiotherapists can provide feedback after examine them.

ReactJS is used for the Front End, NodeJS is used for listening to Kinect streams and Firebase handles all the back end logic (both Google Functions and Firestore Database).

![Logo: ](https://github.com/ezelopes/physio-at-home/tree/master/src/images/homepage_logo.png "Logo Title Text 1")

![Logo: ][logo]

[logo]: https://github.com/ezelopes/physio-at-home/tree/master/src/images/homepage_logo.png "Logo"

## Install:  

Clone down this repository. You will need `node` and `npm` installed globally on your machine. 
To make use of the Kinect V2, make sure you have installed the `Kinect V2 SDK` (link [here](https://www.microsoft.com/en-gb/download/details.aspx?id=44561#:~:text=To%20install%20the%20Kinect%20for,0_1409%2DSetup.exe)).
In order to set up the Firebase Simulator Suite, please follow the official guide on [Firebase](https://firebase.google.com/docs/emulator-suite/install_and_configure).

Installation:

`npm install`  

To Run Test Suite:  

`npm test`  

To Start Client Side:

`npm run client`  

To Start NodeJS Server which listens to Kinect V2:

`npm run server` 

To Start Firebase Emulator:

`firebase emulators:start --import=./path/to/emulator/folder` 

To Visit App:

`localhost:3000/` 

## Limitations:



## Future Work:

- Improve Responsiveness
- Improve Videos Page layout
- Add Location for users with Google Maps
- Create Diagnoses feature for Physiotherapists
