import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import { FaTrash, FaEdit } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useGetAllEventsQuery,
  useDeleteEventMutation,
} from "../../slices/eventApiSlice";

const EventListScreen = () => {
  const { data: events, refetch, isLoading, isError } = useGetAllEventsQuery();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id).unwrap();
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
          <h1>Events</h1>
        </Col>
        <Col className="text-end">
          <Link to="/admin/events/create" className="btn btn-primary my-3">
            <FaEdit /> Add Event
          </Link>
        </Col>
      </Row>
      {isLoading || isDeleting ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">Failed to fetch events</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td>{event.title}</td>
                <td>{event.start}</td>
                <td>{event.end}</td>
                <td>
                  <LinkContainer to={`/admin/events/${event._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(event._id)}
                  >
                    <FaTrash />
                  </Button>
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
