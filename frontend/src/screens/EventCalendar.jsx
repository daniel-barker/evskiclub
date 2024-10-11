import React, { useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Tooltip } from "react-tooltip"; // Use the named export Tooltip
import { useGetAllEventsQuery } from "../slices/eventApiSlice";

const localizer = momentLocalizer(moment);

const EventCalendar = () => {
  // Fetch events using the API slice
  const { data: events, error, isLoading } = useGetAllEventsQuery();

  // Format events for react-big-calendar
  const formattedEvents = useMemo(() => {
    if (events) {
      return events.map((event) => ({
        id: event._id,
        title: event.title,
        description: event.description, // Assuming `post` is the description of the event
        start: new Date(event.start),
        end: new Date(event.end),
        allDay: event.allDay,
      }));
    }
    return [];
  }, [events]);

  // Custom Event Component to display time, title, and tooltip
  const EventComponent = ({ event }) => {
    const startTime = moment(event.start).format("hh:mm A");
    const endTime = moment(event.end).format("hh:mm A");
    const formattedTooltipContent = `
      <strong>${event.title}</strong><br />
      <strong>Time:</strong> ${startTime} - ${endTime}<br />
      <strong>Description:</strong> ${
        event.description || "No description available"
      }
    `;

    return (
      <>
        <span
          data-tooltip-id={`tooltip-${event.id}`}
          data-tooltip-html={formattedTooltipContent}
        >
          {startTime} - {event.title}
        </span>
        <Tooltip
          id={`tooltip-${event.id}`}
          place="top"
          type="dark"
          effect="solid"
          html
          style={{
            whiteSpace: "normal", // Enable word wrapping
            maxWidth: "500px", // Set a max width for the tooltip
            maxHeight: "auto",
            wordWrap: "break-word", // Wrap words that are too long
          }}
        />
      </>
    );
  };

  if (isLoading) {
    return <p>Loading events...</p>;
  }

  if (error) {
    return <p>Error loading events.</p>;
  }

  // Styles
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // Take full viewport height
  };

  const calendarWrapperStyle = {
    width: "80%",
    height: "80vh", // 80% of the viewport height
  };

  const calendarStyle = {
    width: "100%", // Fill the parent div
    height: "100%", // Fill the parent div
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
        />
      </div>
    </div>
  );
};

export default EventCalendar;
