import React, { useState } from 'react';
import { Button, Nav } from 'react-bootstrap'

const ModalUser = ({ userLogOutFunction }) => {

  const currentRole = localStorage.getItem('role');
  const [toggleDiv, setToggleDiv] = useState(false);

  const links = {
    'PATIENT': '/patient/patientAccountPage',
    'PHYSIOTHERAPIST': '/physio/physioAccountPage',
  }

  return (
    <>
      <img 
        src={JSON.parse(localStorage.getItem('userInfo')).photoURL} 
        alt='profile-pic'
        style={{ borderRadius: '25px', cursor: 'pointer'}}
        width='40'
        height='40'
        onClick={() => { setToggleDiv(!toggleDiv); }}
      />
      
      {
        toggleDiv
        ? <div id='userModal'>
            <p>{ currentRole !== 'null' ? currentRole : '' }</p>
            <hr />
            <Nav.Link href={links[currentRole]}> Your Account </Nav.Link> 

            <Button 
              href='/loginPage'
              variant='danger'
              onClick={userLogOutFunction}
            > Log Out </Button>
          </div>
        : null
      }

</> 
  );
}

export default ModalUser;