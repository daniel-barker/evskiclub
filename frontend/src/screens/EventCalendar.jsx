import React, { useState, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, Button } from "react-bootstrap";
import { useGetAllEventsQuery } from "../slices/eventApiSlice";

const localizer = momentLocalizer(moment);

const EventCalendar = () => {
  const { data: events, error, isLoading } = useGetAllEventsQuery();

  const [modalShow, setModalShow] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);

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

  const handleEventClick = (event) => {
    setActiveEvent(event);
    setModalShow(true);
  };

  const handleCloseModal = () => {
    setModalShow(false);
    setActiveEvent(null);
  };

  //   //ics file for apple calendar
  //   const generateICSFile = (event) => {
  //     const formatDate = (date) => {
  //       return moment(date).utc().format("YYYYMMDDTHHmmss[Z]");
  //     };

  //     const startDate = formatDate(event.start);
  //     const endDate = formatDate(event.end);
  //     const summary = event.title;
  //     const description = event.description || "No description provided";
  //     const location = event.location || "No location provided";

  //     return `
  // BEGIN:VCALENDAR
  // VERSION:2.0
  // PRODID:-//Your Organization//NONSGML Your Product//EN
  // BEGIN:VEVENT
  // UID:${event.id}@yourdomain.com
  // DTSTAMP:${formatDate(new Date())}
  // DTSTART:${startDate}
  // DTEND:${endDate}
  // SUMMARY:${summary}
  // DESCRIPTION:${description}
  // LOCATION:${location}
  // END:VEVENT
  // END:VCALENDAR
  //     `;
  //   };
  //   //download dynamically generated ics file
  //   const downloadICSFile = (event) => {
  //     const icsContent = generateICSFile(event);

  //     const blob = new Blob([icsContent], { type: "text/calendar" });
  //     const url = URL.createObjectURL(blob);

  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = `${event.title}.ics`;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   };

  const createGoogleCalendarUrl = (event) => {
    const formatDate = (date) => {
      return moment(date).utc().format("YYYYMMDDTHHmmss[Z]");
    };

    const startDate = formatDate(event.start);
    const endDate = formatDate(event.end);
    const title = encodeURIComponent(event.title);
    const description = encodeURIComponent(event.description || "");
    const location = encodeURIComponent(event.location || "");

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${description}&location=${location}`;
  };

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
            event: EventComponent,
          }}
          onSelectEvent={handleEventClick}
        />
      </div>

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

            {/* Add to Google Calendar Button */}
            <a
              href={createGoogleCalendarUrl(activeEvent)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Add to Google Calendar
            </a>
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
