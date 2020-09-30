import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import firebase from '../../config/firebase.config';

const functions = firebase.functions();

if (process.env.NODE_ENV === 'development') functions.useFunctionsEmulator("http://localhost:5001");

const ProfilePage = () => {

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // const patientDataTemp = { requestsList: [ 'ceSaDuUw8Kd7U9Dl3Vdj4MyEaCd2' ] };

  // const physiotherapistsListTemp = [
  //   {
  //     id: 'ceSaDuUw8Kd7U9Dl3Vdj4MyEaCd2',
  //     specialisation: [],
  //     email: 'up872640@myport.ac.uk',
  //     name: 'Ezequiel Damian Lopes',
  //     role: 'PHYSIOTHERAPIST',
  //   },
  // ];

  const [physiotherapistsList, setPhysiotherapistsList] = useState([]);
  const [patientRequestsList, setPatientRequestsList] = useState([]);

  useEffect(() => {
    const fetchData = async () => { 
     const responsePhysio = await getPhysiotherapistsList(); 
     setPhysiotherapistsList(responsePhysio);
     const patientData = await getPatientData(userInfo.uid);
     setPatientRequestsList(patientData.requestsList);
    }

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPhysiotherapistsList = async () => {
    try {
      const getAllPhysiotherapists = functions.httpsCallable('getAllPhysiotherapists');
      const response = await getAllPhysiotherapists();
      console.log(response);

      return response.data.physiotherapists;
      // return physiotherapistsListTemp
    } catch (err) {
      console.log(err);
    }
  }

  const getPatientData = async (userID) => {
    try {
      const getPatientData = functions.httpsCallable('getPatientData');
      const response = await getPatientData({ patientID: userID });

      return response.data.patientData;
      // return patientDataTemp;
    } catch (err) {
      console.log(err);
    }
  }

  // const convertTimestampToDate = (timestamp) => {
  //   const fomrattedDate = new Date(timestamp * 1000);
  //   const stringDate = fomrattedDate.getDate()+ '/' + (fomrattedDate.getMonth()+1) + '/' + fomrattedDate.getFullYear();
  //   return stringDate;
  // }

  const sendConnectionRequest = async (physioID) => {
    console.log({ physioID, patientID: userInfo.uid, patientEmail: userInfo.email, patientName: userInfo.name })
    const sendConnectionRequest = functions.httpsCallable('sendConnectionRequest');
    const response = await sendConnectionRequest({ 
      physioID, patientID: userInfo.uid, patientEmail: userInfo.email, patientName: userInfo.name 
    });
    console.log(response);
  }

  return (
    <>
      <h2> SEND REQUEST TO YOUR PREFERRED PHYSIOTHERAPISTS </h2>
      <br />

      <Table responsive>
        <thead>
          <tr>
            {Array.from(['Name', 'Email', 'Specialisation', 'Send Request']).map((element, index) => (
              <th key={index}>{element}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from(physiotherapistsList).map((physiotherapist, index) => (
            <tr key={index}>
              <td key='name'>{physiotherapist.name}</td>
              <td key='email'>{physiotherapist.email}</td>
              <td key='specialisation'> 
                {physiotherapist.specialisation.length === 0 ? <h6> NOT SPECIALISED </h6>
                : Array.from(physiotherapist.specialisation).map((currentSpec, index) => (
                <h6 key={index}>{currentSpec}</h6>
                ))}
              </td>
              <td key='sendConnectionRequest'>
                { patientRequestsList.includes(physiotherapist.id) 
                  ? <Button disabled>
                      Request Already Sent
                    </Button>
                  : 
                  <Button onClick={() => { sendConnectionRequest(physiotherapist.id) }}>
                    Send Connection Request
                  </Button>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default ProfilePage;