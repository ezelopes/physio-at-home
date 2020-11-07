import React, { useState } from 'react';
import { Button } from 'react-bootstrap'

const ModalUser = ({ userLogOutFunction }) => {

  const currentRole = localStorage.getItem('role');
  const [toggleDiv, setToggleDiv] = useState(false);

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
            <p>Your Account</p>
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