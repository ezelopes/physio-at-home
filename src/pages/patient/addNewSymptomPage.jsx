import React, { useEffect, useState, useRef } from 'react';
import { Button, Form } from 'react-bootstrap'

import RangeBar from '../../components/rangeBar'

const AddNewSymptomPage = () => {

  const active = '#64c3ef';
  const inactive = '#dbdbdb';

  const painRangeRef = useRef();

  const handleRangeChange = (e) => {
    const { value, min, max } = e.target;
    console.log(min, max)
    const progress = (value/max) * 100 + '%'
    painRangeRef.current.value = value;
    console.log(painRangeRef)
    const newBackgroundStyle = `linear-gradient(90deg, ${active} 0% ${progress}%, ${inactive} ${progress}% 100%)`

    document.getElementById('painRange').value = value; 
    if (value > 50) document.getElementById('painRange').style.backgroundColor = 'red';
    else  document.getElementById('painRange').style.backgroundColor = 'yellow';
    console.log(e.target.value)
  }

  return (
    <>
      <h2 style={{ marginBottom: '1em' }}> Add New Symptoms Here </h2>
      <Form style={{ width: '60%', margin: 'auto', border: 'solid', padding: '2em' }}>
        <Form.Group>
          <Form.Label> Where do you feel pain? </Form.Label>
          <Form.Control
            as="select"
            className="my-1 mr-sm-2"
            id="inlineFormCustomSelectPref"
            custom
          >
            <option value="0">Choose...</option>
            <option value="1">Knee</option>
            <option value="2">Shoulder</option>
            <option value="3">Back</option>
          </Form.Control>
          {/* IMG WITH BUTTONS - DEFAULT VISIBLE FALSE. CHANGE SRC BASED ON SELECTION */}
        </Form.Group>

        <Form.Group style={{ marginTop: '2em' }}>
          <Form.Label>How much pain do you feel?</Form.Label>
          <RangeBar id="sliderId" onChange={(e) => { console.log(e) }} />
        </Form.Group>

        <Form.Group style={{ marginTop: '2em' }}>
          <Form.Label>Please insert more details</Form.Label>
          <Form.Control as='textarea' placeholder="Insert here details..." />
        </Form.Group>

        <Form.Group style={{ marginTop: '2em' }}>
          <Button variant="primary" style={{ marginRight: '1em' }}>
            Record Video
          </Button>
          <Button variant="primary">
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