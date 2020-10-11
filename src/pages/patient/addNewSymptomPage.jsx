import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap'

import RangeBar from '../../components/rangeBar'
import KneeImage from '../../components/kneeImage'

const AddNewSymptomPage = () => {

  const bodyPartsList = [ 'Knee', 'Shoulder', 'Back' ];

  // const submitNewSymptom = async () => {
  //   const temp = document.getElementById('painRangeID');
  //   console.log(temp.value);
  // }

  const [selectedBodyPart, setBodyPart] = useState('Knee');

  const handleBodyPartChange = (e) => {
    const { value } = e.target;
    setBodyPart(value);
  }

  const renderSwitch = (bodyPart) => {
    switch(bodyPart.toUpperCase()) {
      case 'KNEE':
        return <KneeImage />;
      case 'SHOULDER':
        return 'SHOULDER IMG';
      case 'BACK':
        return 'BACK IMG';
      default:
        return null;
    }
  }
  return (
    <>
      <h2 style={{ marginBottom: '1em' }}> Add New Symptoms Here </h2>
      <Form style={{ width: '60%', margin: 'auto', border: 'solid', padding: '2em' }}>
        <Form.Group>
          <Form.Label> Where do you feel pain? </Form.Label>
          <Form.Control
            placeholder='Choose...'
            as="select"
            className="my-1 mr-sm-2"
            id="bodyPartSelect"
            onChange={(e) => { handleBodyPartChange(e) }}
            custom
          >
            {bodyPartsList.map((currentBodyPart, index) => {
              return <option value={currentBodyPart} key={index}> {currentBodyPart} </option>
            })}
          </Form.Control>
          {/* IMG WITH BUTTONS - DEFAULT VISIBLE FALSE. CHANGE SRC BASED ON SELECTION */}
        </Form.Group>
          <div>{renderSwitch(selectedBodyPart)}</div>
          
        {/* <BodyImageComponent bodyPart={selectedBodyPart} /> */}

        <Form.Group style={{ marginTop: '2em' }}>
          <Form.Label>How much pain do you feel?</Form.Label>
          <RangeBar id="painRangeID" />
        </Form.Group>

        <Form.Group style={{ marginTop: '2em' }}>
          <Form.Label>Please insert more details</Form.Label>
          <Form.Control as='textarea' placeholder="Insert here details..." />
        </Form.Group>

        <Form.Group style={{ marginTop: '2em' }}>
          <Button variant="primary" type="button" style={{ marginRight: '1em' }}>
            Record Video
          </Button>
          <Button variant="primary" type="button">
            Upload Video
          </Button>
        </Form.Group>

        <Button variant="success" type="submit" style={{ marginTop: '2em' }}>
          Submit
        </Button>
      </Form>
    </>
  );
}

export default AddNewSymptomPage;