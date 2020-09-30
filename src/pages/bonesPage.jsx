import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap'

// const fetch = require('node-fetch')

const BonesPage = () => {

  const youtubeVideosID = ['N2ukHIBBFAA', 'T7sBeFEu4pw', '1uwAyZ2RyLQ', 'dFpVHc5vtSY', '_nBlN9yp9R8'];

  const [youtubeVideosDetails, setYoutubeVideosDetails] = useState([]);

  const getVideoInfo = async (videoID) => {
    // const apiKey = process.env.REACT_APP_YOUTUBE_ACCESS_TOKEN;
    // const response = await fetch(
    //   `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoID}&key=${apiKey}`, {
    //   method: 'GET',
    //   headers: {
    //     Accept: 'application/json',
    //   }
    // });
    // const body = await response.json();
    // const title = body.items[0].snippet.title;
    // const description = body.items[0].snippet.description;

    // return { videoID, title, description };
    return { videoID, title: 'title', description: 'description' }
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await Promise.all(youtubeVideosID.map(currentID => getVideoInfo(currentID)))
      setYoutubeVideosDetails(response);
    };
 
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
    <h2> Bones Page </h2>

    <Container>
      <Row>
        { youtubeVideosDetails.map((currentVideo) => {
            return <div id={currentVideo.videoID} key={currentVideo.videoID} >
                <Col lg={true} style={{ marginTop: '1.5em' }}>
                  <Card style={{ width: '15em' }}>
                    <Card.Body>
                      <Card.Title> { currentVideo.title } </Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                      <Card.Text>
                        { currentVideo.description }
                      </Card.Text>
                      <Card.Link target="_blank" href={`https://www.youtube.com/watch?v=${currentVideo.videoID}`}>Video Link</Card.Link>
                    </Card.Body>
                  </Card>
                </Col>
              </div>
          }) 
        }
      </Row>
    </Container>
  </>
  );
}

export default BonesPage;