import React, { memo } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap'

const TherapistsDisplayer = ({ physiotherapistsList, patientRequestsList, myPhysiotherapistList, sendInvite, removeConnection, therapistNameFilter, specialisationsFilter }) => {

  
  const checkSpecialisationFilter = (physiotherapistSpecialisation) => {
    const filterSpecialisationsMapped = specialisationsFilter.map(s => s.value);
    return filterSpecialisationsMapped.every(e=> physiotherapistSpecialisation.includes(e));
  }

  const filteredTherapistList = Array.from(physiotherapistsList).filter(therapist => therapist.name.includes(therapistNameFilter) && checkSpecialisationFilter(therapist.specialisations))

  return (
      <Row>
        { filteredTherapistList.length === 0 ? <h2 className='center'> <div> No Therapists meeting the criteria </div> </h2>  
          : filteredTherapistList.map((physiotherapist, index) => {

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
                            Invite Sent!
                          </Button>
                        : (myPhysiotherapistList.includes(physiotherapist.id) 
                          ? <Button
                              variant='danger'
                              id={`${physiotherapist.id}-removeConnectionButton`}
                              onClick={(e) => { removeConnection(e, physiotherapist.id) }}
                            >
                              Remove Connection
                            </Button>
                          : <Button
                              variant='success'
                              id={`${physiotherapist.id}-sendInviteButton`}
                              onClick={(e) => { sendInvite(e, physiotherapist.id) }}>
                              Send Invite
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
  );
}

export default memo(TherapistsDisplayer);
