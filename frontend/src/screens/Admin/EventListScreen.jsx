import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import { FaTrash, FaTimes, FaEdit, FaCheck, FaNewspaper } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useGetAllEventsQuery,
  useDeleteEventMutation,
} from "../../slices/eventsApiSlice";

const EventListScreen = () => {
  const { data: events, refetch, isLoading, error } = useGetAllEventsQuery();

  const [deleteEvent, { isLoading: loadingDelete }] = useDeleteEventMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete an event?")) {
      try {
        await deleteEvent(id);
        toast.success("Event deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Container className="mt-4 form-background">
      <Row className="align-items-center">
        <Col>
          <Link to="/" className="btn btn-secondary my-3">
            Go Back
          </Link>
        </Col>
        <Col>
          <h1>Events</h1>
        </Col>
        <Col className="text-end">
          <Link to="/admin/event/create" className="btn btn-secondary my-3">
            <FaEdit /> Create Event
          </Link>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>NAME</th>
              <th>DATE & TIME</th>
              <th>LOCATION</th>
              <th>PICTURE</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td>{event.title}</td>
                <td>{event.date}</td>
                <td>{event.location}</td>
                <td>
                  {event.image ? (
                    <FaCheck style={{ color: "green" }} />
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/event/${event._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  <Link onClick={() => deleteHandler(event._id)}>
                    <FaTrash color="red" />
                  </Link>
                  <LinkContainer to={`/event/${event._id}`}>
                    <Button variant="light" className="btn-sm">
                      <FaNewspaper />
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default EventListScreen;
