import React, { memo, useState } from 'react';
import { Button, Card, Col, Row, Modal } from 'react-bootstrap'

const TherapistsDisplayer = ({ physiotherapistsList, patientRequestsList, myPhysiotherapistList, sendInvite, removeConnection, therapistNameFilter, specialisationsFilter }) => {

  const [showModalDeleteConfirmation, setShowModalDeleteConfirmation] = useState(false);
  const [selectedPhysiotherapistID, setSelectedPhysiotherapistID] = useState('');
  const [currentButtonTarget, setCurrentButtonTarget] = useState('');

  const handleModalDeleteConfirmation = (buttonTarget, physioID) => {
    setSelectedPhysiotherapistID(physioID);
    setCurrentButtonTarget(buttonTarget)
    setShowModalDeleteConfirmation(true);
  }

  const handleCloseModalDeleteConfirmation = () => {
    setSelectedPhysiotherapistID('');
    setShowModalDeleteConfirmation(false);
  }
  
  const checkSpecialisationFilter = (physiotherapistSpecialisation) => {
    if (physiotherapistSpecialisation) {
      const filterSpecialisationsMapped = specialisationsFilter.map(s => s.value);
      return filterSpecialisationsMapped.every(e=> physiotherapistSpecialisation.includes(e));
    }
  }

  const checkName = (therapist) => {
    if (therapist.name)
      return therapist.name.toUpperCase().includes(therapistNameFilter.toUpperCase())
  }

  const filteredTherapistList = Array.from(physiotherapistsList).filter(therapist => checkName(therapist) && checkSpecialisationFilter(therapist.specialisations))

  try {
    return (
      <>
        <Row>
          { filteredTherapistList.length === 0 ? <h2 className='center'> <div> No Therapists meeting the criteria </div> </h2>  
            : filteredTherapistList.sort((a,b)=> (a.name > b.name ? 1 : -1)).map((physiotherapist, index) => {

              return (
                <div id={index} key={index}>
                  <Col lg={true}>
                    <Card>
                      <Card.Body>
                        <Card.Title> {physiotherapist.name} </Card.Title>
                        <Card.Text>
                          Email: {physiotherapist.email}
                        </Card.Text>
                        <Card.Text> 
                          Specialisations: <br />
                          { physiotherapist.specialisations.length === 0
                            ? <b> NOT SPECIALISED </b>
                            : Array.from(physiotherapist.specialisations).map((currentSpec, index) => (
                                <b key={index}> {currentSpec} <br /> </b>
                              ))
                          }
                        </Card.Text>
                        { patientRequestsList.includes(physiotherapist.id) 
                          ? <Button disabled>
                              Connection Sent!
                            </Button>
                          : (myPhysiotherapistList.includes(physiotherapist.id) 
                            ? <Button
                                variant='danger'
                                id={`${physiotherapist.id}-removeConnectionButton`}
                                onClick={(e) => { 
                                  handleModalDeleteConfirmation(e.target, physiotherapist.id)
                                }}
                              >
                                Remove Connection
                              </Button>
                            : <Button
                                variant='success'
                                id={`${physiotherapist.id}-sendInviteButton`}
                                onClick={(e) => { sendInvite(e, physiotherapist.id) }}>
                                Request Connection
                              </Button>
                          )
                        }
                      </Card.Body>
                    </Card>
                  </Col>
                </div>
              )
            })
          }
        </Row>

        <Modal show={showModalDeleteConfirmation} onHide={handleCloseModalDeleteConfirmation} centered>
          <Modal.Header closeButton>
              <Modal.Title> Delete Confirmation </Modal.Title>
            </Modal.Header>
            <Modal.Body> Are you sure about deleting this Connection? </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => { handleCloseModalDeleteConfirmation() } }>
                Close
              </Button>
              <Button variant="danger" onClick={async (e) => { 
                e.target.disabled = true;
                removeConnection(currentButtonTarget, selectedPhysiotherapistID).then(() => {
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

export default memo(TherapistsDisplayer);
