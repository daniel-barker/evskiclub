import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import {
  useGetEventByIdQuery,
  useUpdateEventMutation,
  useUploadEventImageMutation,
} from "../../slices/eventsApiSlice";

const EventEditScreen = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const { data: event, isLoading, error } = useGetEventByIdQuery(id);

  const [updateEvent, { isLoading: loadingUpdate }] = useUpdateEventMutation();

  const [uploadImage, { isLoading: loadingUpload }] =
    useUploadEventImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDate(event.date);
      setLocation(event.location);
      setDescription(event.description);
      setImage(event.image);
      setThumbnail(event.thumbnail);
    }
  }, [event]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const updatedEvent = {
      id,
      title,
      date,
      location,
      description,
      image,
      thumbnail,
    };
    try {
      const result = await updateEvent(updatedEvent);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Event updated successfully");
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
      formData.append("image", file);
      try {
        const res = await uploadImage(formData).unwrap();
        toast.success(res.message);
        setImage(res.image);
        setThumbnail(res.thumbnail);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      {loadingUpdate && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Container className="mt-3">
          <Link to="/admin/event/list" className="btn btn-light my-3">
            Go Back
          </Link>
          <FormContainer>
            <h1 className="text-center">Edit Event</h1>
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
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date-time"
                  placeholder="Enter date"
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
                  rows={3}
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group className="pb-3" controlId="image">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  label="Choose File"
                  onChange={uploadFileHandler}
                ></Form.Control>
              </Form.Group>

              {loadingUpload && <Loader />}
              <Button type="submit" variant="primary">
                Update
              </Button>
            </Form>
          </FormContainer>
        </Container>
      )}
    </>
  );
};

export default EventEditScreen;
