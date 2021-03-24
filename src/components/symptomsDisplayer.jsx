import React, { memo, useEffect, useState } from 'react';
import { Button, Card, Col, ListGroup, Modal } from 'react-bootstrap'

const SymptomsDisplayer = ({ updated, symptoms, deleteSymptom, handleShowModal, userInfo }) => {

  const [symptomsList, setSymptomsList] = useState([]);
  const [selectedSymtomID, setSelectedSymtomID] = useState('');
  const [showModalDeleteConfirmation, setShowModalDeleteConfirmation] = useState(false);

  useEffect(() => {
    setSymptomsList(symptoms);
    console.log(symptoms)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updated]);

  const convertDate = (dateInSeconds) => {
    const pad = (s) => { return (s < 10) ? '0' + s : s; }

    const d = new Date(dateInSeconds * 1000)
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('-')
  }

  const handleModalDeleteConfirmation = (symptomID) => {
    setSelectedSymtomID(symptomID);
    setShowModalDeleteConfirmation(true);
  }

  const handleCloseModalDeleteConfirmation = () => {
    setSelectedSymtomID('');
    setShowModalDeleteConfirmation(false);
  }

  try {
    return (
      <>
        { Object.keys(symptomsList).length === 0 ? <h2 className='center'> <div> No Symptoms to Display Yet </div> </h2>  
          : Object.keys(symptomsList).map((currentSymptomID) => {
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
                      symptomsList[currentSymptomID].bodyPart.bodyPart
                    }
                  </Card.Text>
                  <Card.Text>
                    Specific Body Part:
                  </Card.Text>
                  <ListGroup style={{ marginBottom: '1em' }}> 
                    { symptomsList[currentSymptomID].bodyPart.specificBodyPart.map((item, index) => { 
                      return <ListGroup.Item key={index}> {item} </ListGroup.Item>}) 
                    }
                  </ListGroup>
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
                    disabled={showModalDeleteConfirmation}
                    onClick={(e) => { 
                      // e.target.disabled = true;
                      handleModalDeleteConfirmation(currentSymptomID);
                      // deleteSymptom(userInfo.uid, currentSymptomID);
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

      <Modal show={showModalDeleteConfirmation} onHide={handleCloseModalDeleteConfirmation} centered>
        <Modal.Header closeButton>
            <Modal.Title> Delete Confirmation </Modal.Title>
          </Modal.Header>
          <Modal.Body> Are you sure about deleting this Symptom? </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { handleCloseModalDeleteConfirmation() } }>
              Close
            </Button>
            <Button variant="danger" onClick={async (e) => { 
              e.target.disabled = true;
              deleteSymptom(userInfo.uid, selectedSymtomID).then(() => {
                handleCloseModalDeleteConfirmation()
              }).catch(() => {})
            } }>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
    </>
    );
  } catch(err) {
    return (<h2> An Error Occured when displaying the data. Please try again or contact an Administrator </h2>)
  }
}

export default memo(SymptomsDisplayer);