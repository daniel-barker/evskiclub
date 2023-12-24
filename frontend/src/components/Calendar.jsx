// src/components/EventCalendar.js
import React from "react";
import { useGetFutureEventsQuery } from "../slices/eventsApiSlice";

function EventCalendar() {
  const { data: events, isLoading, isError } = useGetFutureEventsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching events</p>;

  const groupEventsByDate = (events) => {
    const groups = events.reduce((groups, event) => {
      // Extract the date part from the datetime string
      const date = event.date.split("T")[0]; // Adjust if your date format is different
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
      return groups;
    }, {});

    // Sort the groups by date
    return Object.keys(groups)
      .sort()
      .reduce((sortedGroups, date) => {
        sortedGroups[date] = groups[date];
        return sortedGroups;
      }, {});
  };

  const groupedEvents = groupEventsByDate(events);

  return (
    <div>
      {Object.entries(groupedEvents).map(([date, events]) => (
        <div key={date}>
          <h2>{new Date(date).toDateString()}</h2>
          {events.map((event) => (
            <div key={event._id}>
              <h3>{event.title}</h3>
              {/* Render other details */}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default EventCalendar;
