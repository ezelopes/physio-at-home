import React, { memo } from 'react';
import YouTube from 'react-youtube';
import { Accordion, Card, Container, Row, Col } from 'react-bootstrap'

const VideosPage = () => {

  const specialisations = [
    { id: 'SHOULDER', name: 'SHOULDER' },
    { id: 'KNEE', name: 'KNEE' },
    { id: 'BACK', name: 'BACK' },
    { id: 'ELBOW', name: 'ELBOW' },
  ]

  const youtubeVideosIDTemp = {
    SHOULDER: ['T7sBeFEu4pw'],
    KNEE: ['N2ukHIBBFAA'],
    BACK: ['1uwAyZ2RyLQ'],
    ELBOW: ['dFpVHc5vtSY']
  }
  
  const opts = {
    height: '170',
    width: '302.22',
    playerVars: {
      autoplay: 0,
    },
  };

  try {
    return (
      <>
        <Container>
          <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              { specialisations.map((specialisation, index) => {
                return (
                  <Accordion className='first-element' key={index}>
                    <Card id='videos-card' key={index}>

                      <Accordion.Toggle as={Card.Header} eventKey={specialisation.id}>
                        <b>{specialisation.name}</b>
                      </Accordion.Toggle>

                      <Accordion.Collapse eventKey={specialisation.id}>
                        <Card.Body style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Row>
                          { youtubeVideosIDTemp[specialisation.id].map(currentVideoID => {
                              return <div id={currentVideoID} key={currentVideoID}> 
                                <Col lg={true}>
                                  <YouTube videoId={currentVideoID} opts={opts} key={currentVideoID} />
                                </Col>
                              </div>
                            })
                          }
                          </Row>
                        </Card.Body>
                      </Accordion.Collapse>

                    </Card>
                  </Accordion>
                )
              })}
          </Row>
        </Container>
      </>
    );  
  } catch(err) {
    return (<h2> An Error Occured when displaying the data. Please try again or contact an Administrator </h2>)
  }
}

export default memo(VideosPage);