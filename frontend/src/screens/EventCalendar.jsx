import React, { useState, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, Button } from "react-bootstrap"; // Import Modal and Button from react-bootstrap
import { useGetAllEventsQuery } from "../slices/eventApiSlice";

const localizer = momentLocalizer(moment);

const EventCalendar = () => {
  const { data: events, error, isLoading } = useGetAllEventsQuery();

  const [modalShow, setModalShow] = useState(false); // Track modal visibility
  const [activeEvent, setActiveEvent] = useState(null); // Track the active event for the modal

  // Format events for react-big-calendar
  const formattedEvents = useMemo(() => {
    if (events) {
      return events.map((event) => ({
        id: event._id,
        title: event.title,
        description: event.description,
        start: new Date(event.start),
        end: new Date(event.end),
        allDay: event.allDay,
      }));
    }
    return [];
  }, [events]);

  // Open modal when the user clicks the event
  const handleEventClick = (event) => {
    setActiveEvent(event); // Set the active event data
    setModalShow(true); // Show the modal
  };

  // Close modal
  const handleCloseModal = () => {
    setModalShow(false); // Hide the modal
    setActiveEvent(null); // Reset active event
  };

  // Custom Event Component to display time, title, and handle click
  const EventComponent = ({ event }) => {
    const startTime = moment(event.start).format("hh:mm A");
    const endTime = moment(event.end).format("hh:mm A");

    return (
      <span>
        {event.title} ({startTime} - {endTime})
      </span>
    );
  };

  if (isLoading) {
    return <p>Loading events...</p>;
  }

  if (error) {
    return <p>Error loading events...</p>;
  }

  // Styles
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  const calendarWrapperStyle = {
    width: "80%",
    height: "80vh",
  };

  const calendarStyle = {
    width: "100%",
    height: "100%",
  };

  return (
    <div style={containerStyle}>
      <div style={calendarWrapperStyle}>
        <Calendar
          localizer={localizer}
          events={formattedEvents}
          startAccessor="start"
          endAccessor="end"
          style={calendarStyle}
          components={{
            event: EventComponent, // Use the custom event component
          }}
          onSelectEvent={handleEventClick} // Makes the entire event bar clickable
        />
      </div>

      {/* Modal to display event details */}
      {activeEvent && (
        <Modal show={modalShow} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{activeEvent.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Time:</strong>{" "}
              {moment(activeEvent.start).format("hh:mm A")} -{" "}
              {moment(activeEvent.end).format("hh:mm A")}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {activeEvent.description || "No description available"}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default EventCalendar;
