import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import DatePicker from "react-datepicker"; // for date picking
import "react-datepicker/dist/react-datepicker.css"; // DatePicker styling
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import { useCreateEventMutation } from "../../slices/eventApiSlice";

const EventCreateScreen = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // New state for description
  const [start, setStart] = useState(null); // start date
  const [end, setEnd] = useState(null); // end date
  const [allDay, setAllDay] = useState(false);

  const [createEvent, { isLoading: loadingCreate }] = useCreateEventMutation();

  const navigate = useNavigate();

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
      const newEvent = {
        title,
        description,
        start,
        end,
        allDay,
      };

      const createResult = await createEvent(newEvent);
      if (createResult.data) {
        toast.success("Event created successfully");
        navigate("/admin/events/list");
      } else {
        throw new Error("Event creation failed");
      }
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error.error ||
          "An error occurred during event creation."
      );
    }
  };

  return (
    <Container>
      <Link to="/admin/events/list" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1 className="text-center">Create Event</h1>
        {loadingCreate && <Loader />}
        <Form onSubmit={submitHandler}>
          {/* Event Title */}
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></Form.Control>
          </Form.Group>

          {/* Event Description */}
          <Form.Group controlId="description" className="mt-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3} // Make it a multi-line textarea
              placeholder="Enter event description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Form.Control>
          </Form.Group>

          {/* Start Date */}
          <Form.Group controlId="start" className="mt-3">
            <Form.Label>Start Date and Time</Form.Label>
            <DatePicker
              selected={start}
              onChange={(date) => setStart(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="Pp"
              placeholderText="Select start date and time"
              className="form-control"
            />
          </Form.Group>

          {/* End Date */}
          <Form.Group controlId="end" className="mt-3">
            <Form.Label>End Date and Time</Form.Label>
            <DatePicker
              selected={end}
              onChange={(date) => setEnd(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="Pp"
              placeholderText="Select end date and time"
              className="form-control"
            />
          </Form.Group>

          {/* All Day Checkbox */}
          <Form.Group controlId="allDay" className="mt-3">
            <Form.Check
              type="checkbox"
              label="All Day Event"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
            ></Form.Check>
          </Form.Group>

          {/* Submit Button */}
          <Button type="submit" variant="primary" className="mt-3">
            Create Event
          </Button>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default EventCreateScreen;
