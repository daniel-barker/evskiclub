import { useGetFutureEventsQuery } from "../slices/eventsApiSlice";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function EventCalendar() {
  const { data: events, isLoading, isError } = useGetFutureEventsQuery();

  const extractTime = (datetime) => {
    const time = new Date(datetime).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return time;
  };

  const groupEventsByDate = (events) => {
    const groups = events.reduce((groups, event) => {
      // Extract the date part from the datetime string
      const date = event.date.split("T")[0];
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

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching events</p>;

  const groupedEvents = groupEventsByDate(events);

  return (
    <div>
      {Object.entries(groupedEvents).map(([date, events]) => (
        <div key={date}>
          <h2 className="event-title-shade">{new Date(date).toDateString()}</h2>
          {events.map((event) => (
            <div className="text-center" key={event._id}>
              <h3>
                {`${event.title} - ${extractTime(event.date)}`}{" "}
                <Link to={`/event/${event._id}`}>
                  <FontAwesomeIcon
                    aria-label="Expand image"
                    icon={faMagnifyingGlass}
                    color="#01467f"
                  />
                </Link>
              </h3>

              <hr />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default EventCalendar;
