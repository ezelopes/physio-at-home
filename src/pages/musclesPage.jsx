import React from 'react';
import YouTube from 'react-youtube';
import { Container, Row, Col } from 'react-bootstrap'

const MusclesPage = () => {

  const youtubeVideosID = ['N2ukHIBBFAA', 'T7sBeFEu4pw', '1uwAyZ2RyLQ', 'dFpVHc5vtSY', '_nBlN9yp9R8'];
  
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
      <h2> Muscles Page </h2>

      <Container>
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
      </Container>
    </>
  );  
}

export default MusclesPage;