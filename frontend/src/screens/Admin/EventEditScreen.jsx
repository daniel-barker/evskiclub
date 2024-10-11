import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import { Form, Button, Container, Row, Col } from "react-bootstrap";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
  useGetSingleEventQuery,
  useUpdateEventMutation,
} from "../../slices/eventApiSlice";

const EventEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [allDay, setAllDay] = useState(false);

  // Fetch event data and handle loading, error states
  const { data: event, isLoading, error } = useGetSingleEventQuery(id);
  const [updateEvent, { isLoading: isLoadingUpdate }] =
    useUpdateEventMutation();

  // Populate form fields with event data
  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setStart(new Date(event.start));
      setEnd(new Date(event.end));
      setAllDay(event.allDay);
    }
  }, [event]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!title || !start || !end) {
      toast.error("Please provide a title, start date, and end date");
      return;
    }

    if (new Date(start) > new Date(end)) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      const updatedEvent = {
        id,
        title,
        description,
        start,
        end,
        allDay,
      };

      await updateEvent(updatedEvent);
      toast.success("Event updated successfully");
      navigate("/admin/events/list");
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error.error ||
          "An error occurred during event update."
      );
    }
  };

  return (
    <Container>
      <Link to="/admin/events/list" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Event</h1>
        {isLoading || isLoadingUpdate ? (
          <Loader />
        ) : error ? (
          // Make sure to display a meaningful error message
          <Message variant="danger">
            {error?.data?.message || error?.error || "Error loading event"}
          </Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter event description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Row>
              <Col>
                <Form.Group controlId="start">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={start ? start.toISOString().slice(0, 16) : ""}
                    onChange={(e) => setStart(new Date(e.target.value))}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="end">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={end ? end.toISOString().slice(0, 16) : ""}
                    onChange={(e) => setEnd(new Date(e.target.value))}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="allDay">
              <Form.Check
                type="checkbox"
                label="All Day Event"
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
              ></Form.Check>
            </Form.Group>
            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </Container>
  );
};

export default EventEditScreen;
