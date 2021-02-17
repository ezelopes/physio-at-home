import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from 'react-tooltip';



const IconWithMessage = ({ message }) => {

  return (
    <>
      <ReactTooltip />
      <FontAwesomeIcon data-tip={message} icon={faQuestionCircle} />
    </>
  )
}

export default IconWithMessage;