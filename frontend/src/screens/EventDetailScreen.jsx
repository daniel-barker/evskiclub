import { useParams, Link } from "react-router-dom";
import { useGetEventByIdQuery } from "../slices/eventsApiSlice";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Image,
  Modal,
} from "react-bootstrap";
import { useState } from "react";

const EventDetailScreen = () => {
  const { id } = useParams();
  const { data: event, isLoading, isError } = useGetEventByIdQuery(id);

  const [showImage, setShowImage] = useState(false);

  const handleShowImage = () => setShowImage(true);
  const handleHideImage = () => setShowImage(false);

  const extractDateTime = (datetime) => {
    const date = new Date(datetime).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const time = new Date(datetime).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${date} at ${time}`;
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching event</p>;

  return (
    <>
      <Container className="event-detail-container">
        <Card>
          <Card.Body className="text-center">
            <Row>
              <Col>
                <Card.Title>
                  <h2>{event.title}</h2>
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {extractDateTime(event.date)}
                </Card.Subtitle>
                <Card.Text>{event.description}</Card.Text>
                <Card.Text>{event.location}</Card.Text>
              </Col>
              {event.image ? (
                <Col md={4}>
                  <Image
                    src={`/${event.thumbnail}`}
                    alt={event.title}
                    fluid
                    onClick={showImage ? handleHideImage : handleShowImage}
                  />
                </Col>
              ) : null}
            </Row>
          </Card.Body>
        </Card>
        <br />
        <Link to="/home" className="btn btn-secondary">
          Back
        </Link>
      </Container>

      <Modal show={showImage} onHide={handleHideImage} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{event.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Image src={`/${event.image}`} alt={event.title} fluid />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleHideImage}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default EventDetailScreen;
