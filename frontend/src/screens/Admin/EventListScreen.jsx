import React, { useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Table, Button, Container, Row, Col, Form } from "react-bootstrap";
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

  const [eventNameFilter, setEventNameFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

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

  // Filter events based on event name and date range
  const filteredEvents = events?.filter((event) => {
    const matchesEventName = event.title
      .toLowerCase()
      .includes(eventNameFilter.toLowerCase());
    const withinStartDate =
      !startDateFilter || new Date(event.start) >= new Date(startDateFilter);
    const withinEndDate =
      !endDateFilter || new Date(event.end) <= new Date(endDateFilter);
    return matchesEventName && withinStartDate && withinEndDate;
  });

  return (
    <Container className="mt-4 form-background">
      <Row className="align-items-center">
        <Col>
          <h1>Events</h1>
        </Col>
        <Col xs="auto" className="text-end">
          <Link to="/admin/events/create" className="btn btn-primary my-3">
            Add Event
          </Link>
        </Col>
      </Row>

      {/* Filter Controls */}
      <Row className="my-3">
        <Col md={4}>
          <Form.Label>Event Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Filter by Event Name"
            value={eventNameFilter}
            onChange={(e) => setEventNameFilter(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Label>Date Range Start</Form.Label>
          <Form.Control
            type="date"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Label>Date Range End</Form.Label>
          <Form.Control
            type="date"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
          />
        </Col>
      </Row>

      {isLoading || isDeleting ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">Failed to fetch events</Message>
      ) : (
        <Table
          striped
          hover
          responsive
          className="table-sm text-center mx-auto"
        >
          <thead>
            <tr>
              <th className="fs-5">Event Name</th>
              <th className="fs-5">Start Date</th>
              <th className="fs-5">End Date</th>
              <th className="fs-5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event._id}>
                <td className="align-middle fs-5">{event.title}</td>
                <td className="align-middle fs-5">{event.start}</td>
                <td className="align-middle fs-5">{event.end}</td>
                <td className="align-middle fs-5">
                  <LinkContainer to={`/admin/events/${event._id}/edit`}>
                    <Button className="me-3">Edit</Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    onClick={() => deleteHandler(event._id)}
                  >
                    Delete
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
