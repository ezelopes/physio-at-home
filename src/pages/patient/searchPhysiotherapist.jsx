import React, { useState, useEffect } from 'react';
import firebase from '../../config/firebase.config';

const functions = firebase.functions();

const ProfilePage = () => {

  const [physiotherapistsList, setPhysiotherapistsList] = useState([]);

  useEffect(() => {
    const fetchData = async () => { 
     const response = await getPhysiotherapists(); 
     setPhysiotherapistsList(response);
    }

    fetchData();
  }, []);

  const getPhysiotherapists = async () => {
    try {
      const getAllPhysiotherapists = functions.httpsCallable('getAllPhysiotherapists');
      const response = await getAllPhysiotherapists();
      console.log(response);

      return response.data.physiotherapists;
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <h2> SEND REQUEST TO YOUR PREFERRED PHYSIOTHERAPISTS </h2>
      <br />
      { physiotherapistsList.map((currentPhysiotherapist, index) => {
          return <div key={index}>
            { currentPhysiotherapist.email }
          </div>
      }) }
    </>
  );
}

export default ProfilePage;