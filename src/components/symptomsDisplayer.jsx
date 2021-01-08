import React, { useEffect, useState } from 'react';
import { Button, Card, Col } from 'react-bootstrap'

const SymptomsDisplayer = ({ updated, symptoms, deleteSymptom, handleShowModal, userInfo }) => {

  const [symptomsList, setSymptomsList] = useState([]);

  useEffect(() => {
    setSymptomsList(symptoms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updated]);

  return (
    <>
      { Object.keys(symptomsList).map((currentSymptomID) => {
        return <div id={currentSymptomID} key={currentSymptomID}>
          <Col lg={true}>
            <Card style={{ width: '23em' }}>
              <Card.Body style={{'maxHeight': '50vh', 'overflowY': 'auto'}}>
                <Card.Title>
                  { symptomsList[currentSymptomID].symptomTitle }
                </Card.Title>
                <Card.Text>
                  Body Part: { 
                    symptomsList[currentSymptomID].bodyPart.rightOrLeft + ' ' + 
                    symptomsList[currentSymptomID].bodyPart.bodyPart + ' (' + 
                    symptomsList[currentSymptomID].bodyPart.specificBodyPart + ')' 
                  }
                </Card.Text>
                <Card.Text>
                  Pain Range Value: { symptomsList[currentSymptomID].painRangeValue }
                </Card.Text>
                <Card.Text>
                  Details: { symptomsList[currentSymptomID].symptomDetails }
                </Card.Text>
                <Card.Text>
                  Range of Motion: { 
                    symptomsList[currentSymptomID].rangeOfMotion.minAngle + '° to ' + 
                    symptomsList[currentSymptomID].rangeOfMotion.maxAngle + '°'
                  }
                </Card.Text>

                <Button 
                  style={{ marginRight: '1em' }}
                  id={`read-${currentSymptomID}`}
                  variant="success"
                  onClick={() => { handleShowModal(currentSymptomID) }}
                >
                  Read Feedbacks!
                </Button>

                <Button 
                  id={`delete-${currentSymptomID}`}
                  variant="danger"
                  onClick={() => { deleteSymptom(userInfo.uid, currentSymptomID) }}
                >
                  Delete Symptom
                </Button>

              </Card.Body>
            </Card>
          </Col>
        </div>
      })
    }
  </>
  );
}

export default SymptomsDisplayer;