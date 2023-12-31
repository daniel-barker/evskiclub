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
  const [thumbnail, setThumbnail] = useState("");

  const [createEvent, { isLoading: loadingCreate }] = useCreateEventMutation();
  const [uploadImage, { isLoading: loadingUpload }] =
    useUploadEventImageMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const newEvent = {
      title,
      date,
      location,
      description,
      image,
      thumbnail,
    };
    try {
      const result = await createEvent(newEvent);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Event created successfully");
        navigate("/admin/event/list");
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      formData.append("type", "event");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      try {
        const res = await uploadImage(formData).unwrap();
        toast.success(res.message);
        setImage(res.image);
        setThumbnail(res.thumbnail);
      } catch (err) {
        console.error("Upload error:", err);
        if (err.data && typeof err.data === "object") {
          console.error("Error details:", JSON.stringify(err.data, null, 2));
        }
        toast.error(err?.data?.message || err.error || "An error occurred");
      }
    }
  };

  return (
    <Container>
      <Link to="/admin/event/list" className="btn btn-secondary my-3">
        Go Back
      </Link>
      <FormContainer>
        <div className="form-background">
          <h1>Create Event</h1>
          {loadingCreate && <Loader />}
          {loadingUpload && <Loader />}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="date">
              <Form.Label>Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Choose Image</Form.Label>
              <Form.Control
                type="file"
                id="image-file"
                label="Choose Image"
                onChange={uploadFileHandler}
              ></Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary">
              Create
            </Button>
          </Form>
        </div>
      </FormContainer>
    </Container>
  );
};

export default EventCreateScreen;
