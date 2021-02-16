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
    width: '240',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };

  return (
    <>
      {/* <h2> Videos </h2> */}

      <Container>
        <Row>
            { specialisations.map((specialisation, index) => {
              return (
                <Accordion className='first-element' key={index}>
                  <Card id='videos-card' key={index}>

                    <Accordion.Toggle as={Card.Header} eventKey={specialisation.id}>
                      <b>{specialisation.name}</b>
                    </Accordion.Toggle>

                    <Accordion.Collapse eventKey={specialisation.id}>
                      <Card.Body>
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

      {/* <Container>
        <Row>
          { youtubeVideosID.map((currentID) => {
              return <div id={currentID} key={currentID}>
                  <Col lg={true}>
                    <YouTube videoId={currentID} opts={opts} />
                  </Col>
                </div>
              })
          }
        </Row>
      </Container> */}
    </>
  );  
}

export default memo(VideosPage);