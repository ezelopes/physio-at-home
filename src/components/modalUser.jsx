import React, { useEffect, useState, useRef } from 'react';
import { Button, Nav } from 'react-bootstrap'

const ModalUser = ({ userLogOutFunction }) => {

  const currentRole = localStorage.getItem('role');
  const [toggleDiv, setToggleDiv] = useState(false);
  const node = useRef();

  const links = {
    'PATIENT': '/patient/patientAccountPage',
    'PHYSIOTHERAPIST': '/physio/physioAccountPage',
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleModalClick);

    return () => {
      document.removeEventListener("mousedown", handleModalClick);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleModalClick = (e) => {
    if (node.current.contains(e.target)) {
      // inside click
      return;
    }

    setToggleDiv(false)
  }

  return (
    <>
    <div ref={node}>
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
            <Nav.Link style={{ marginTop: '-1em'}} href={links[currentRole]}> Your Account </Nav.Link> 

            <Button 
              href='/loginPage'
              variant='danger'
              onClick={userLogOutFunction}
            > Log Out </Button>
          </div>
        : null
      }

    </div> 
    </>
  );
}

export default ModalUser;