import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
  useCreateEventMutation,
  useUploadEventImageMutation,
} from "../../slices/eventsApiSlice";

const EventCreateScreen = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const [createEvent, { isLoading: loadingCreate }] = useCreateEventMutation();
  const [uploadImage, { isLoading: loadingUpload }] =
    useUploadEventImageMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (image) {
      const formData = new FormData();
      formData.append("image", image);

      try {
        const uploadResult = await uploadImage(formData).unwrap();

        const newEvent = {
          title,
          date,
          location,
          description,
          image: uploadResult.image,
          thumbnail: uploadResult.thumbnail,
        };

        const createResult = await createEvent(newEvent);
        if (createResult.data) {
          toast.success("Event created successfully");
          navigate("/admin/event/list");
        } else {
          throw new Error("Event creation failed");
        }
      } catch (error) {
        toast.error(
          error?.data?.message ||
            error.error ||
            "An error occurred during upload or event creation."
        );
      }
    } else {
      //handle events without images
      try {
        const newEvent = { title, date, location, description };
        const result = await createEvent(newEvent);
        if (result.error) {
          throw new Error(result.error);
        } else {
          toast.success("Event created successfully");
          navigate("/admin/event/list");
        }
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <Container className="mt-3">
      <Link to="/admin/event/list" className="btn btn-secondary my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1 className="text-center">Create Event</h1>
        {loadingCreate && <Loader />}
        {loadingUpload && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group className="pb-3" controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="pb-3" controlId="date">
            <Form.Label>Date & Time</Form.Label>
            <Form.Control
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="pb-3" controlId="location">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="pb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={8}
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="pb-4">
            <Form.Label>Choose Image (optional)</Form.Label>
            <Form.Control
              type="file"
              id="image-file"
              label="Choose Image"
              onChange={imageHandler}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" variant="primary">
            Create
          </Button>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default EventCreateScreen;
