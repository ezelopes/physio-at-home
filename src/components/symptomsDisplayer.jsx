import React, { memo, useEffect, useState } from 'react';
import { Button, Card, Col } from 'react-bootstrap'

const SymptomsDisplayer = ({ updated, symptoms, deleteSymptom, handleShowModal, userInfo }) => {

  const [symptomsList, setSymptomsList] = useState([]);

  useEffect(() => {
    setSymptomsList(symptoms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updated]);

  const convertDate = (dateInSeconds) => {
    const pad = (s) => { return (s < 10) ? '0' + s : s; }

    const d = new Date(dateInSeconds * 1000)
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('-')
  }

  return (
    <>
      { Object.keys(symptomsList).map((currentSymptomID) => {
        return <div id={currentSymptomID} key={currentSymptomID}>
          <Col lg={true}>
            <Card>
              <Card.Body>
                <Card.Title>
                  { symptomsList[currentSymptomID].symptomTitle }
                </Card.Title>
                <Card.Text>
                  Date Created: { convertDate(symptomsList[currentSymptomID].creationDate._seconds) }
                </Card.Text>
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
                  className='left-button'
                  id={`read-${currentSymptomID}`}
                  variant="success"
                  onClick={() => { handleShowModal(currentSymptomID) }}
                >
                  Read Feedbacks!
                </Button>

                <Button 
                  id={`delete-${currentSymptomID}`}
                  variant="danger"
                  onClick={(e) => { 
                    e.target.disabled = true;
                    deleteSymptom(userInfo.uid, currentSymptomID);
                  }}
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

export default memo(SymptomsDisplayer);