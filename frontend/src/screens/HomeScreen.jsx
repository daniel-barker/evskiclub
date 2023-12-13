import React, { useState } from "react";
import { Container, Modal, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";

const handleDateClick = (arg) => {
  alert(arg.dateStr);
};

const HomeScreen = () => {
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const openCalendarModal = () => setShowCalendarModal(true);
  const closeCalendarModal = () => setShowCalendarModal(false);

  const apiKey = process.env.REACT_APP_GAPI_KEY;
  const calId = process.env.REACT_APP_CAL_ID;

  return (
    <Container>
      <Row>
        <Col md={5}>
          <Card>
            <Card.Body>
              <Card.Title>News card</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}></Col>
        <Col md={5}>
          <Card>
            <Card.Body>
              <Card.Title>Photo Gallery Carousel</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <br />
      <div style={{ backgroundColor: "#f5f5f5" }}>
        <FullCalendar
          plugins={[dayGridPlugin, googleCalendarPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          googleCalendarApiKey={apiKey}
          events={{
            googleCalendarId: calId,
            className: "gcal-event",
          }}
        />
      </div>
    </Container>
  );
};

export default HomeScreen;

{
  /* <>
<Container className="text-center">
  <Link
    className="btn btn-primary mb-4"
    onClick={() => openCalendarModal()}
  >
    Calendar
  </Link>{" "}
</Container>
<Modal
  show={showCalendarModal}
  onHide={closeCalendarModal}
  size="xl"
  centered
>
  <Modal.Body>
    <FullCalendar
      plugins={[dayGridPlugin, googleCalendarPlugin]}
      initialView="dayGridMonth"
      dateClick={handleDateClick}
      googleCalendarApiKey=""
      events={{
        googleCalendarId: "dbarker16@gmail.com",
        className: "gcal-event",
      }}
    />
  </Modal.Body>
  <Modal.Footer>
    <Link className="btn btn-primary" onClick={closeCalendarModal}>
      Close
    </Link>
  </Modal.Footer>
</Modal>
</> */
}
