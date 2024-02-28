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
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(""); // For new image file selection
  const [originalImage, setOriginalImage] = useState(""); // Store original image URL
  const [originalThumbnail, setOriginalThumbnail] = useState(""); // Store original thumbnail URL
  const [removeImage, setRemoveImage] = useState(false);

  const { data: event, isLoading, error } = useGetEventByIdQuery(id);
  const [updateEvent, { isLoading: loadingUpdate }] = useUpdateEventMutation();
  const [uploadImage, { isLoading: loadingUpload }] =
    useUploadEventImageMutation();

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDate(event.date);
      setLocation(event.location);
      setDescription(event.description);
      setOriginalImage(event.image); // Assuming 'event.image' holds the URL to the existing image
      setOriginalThumbnail(event.thumbnail); // Assuming 'event.thumbnail' holds the URL to the existing thumbnail
    }
  }, [event]);

  const submitHandler = async (e) => {
    e.preventDefault();

    // Start with the base event details
    const updatedEvent = {
      id,
      title,
      date,
      location,
      description,
    };

    // If the 'removeImage' checkbox is not checked and a new image has been selected, proceed with image upload
    if (!removeImage && image instanceof File) {
      try {
        const formData = new FormData();
        formData.append("image", image);
        const uploadResult = await uploadImage(formData).unwrap();
        updatedEvent.image = uploadResult.image;
        updatedEvent.thumbnail = uploadResult.thumbnail;
      } catch (error) {
        toast.error(
          "Failed to upload new image: " +
            (error?.data?.message || error.message)
        );
        return; // Exit early if image upload fails
      }
    } else if (removeImage) {
      // If 'removeImage' is checked, ensure 'image' and 'thumbnail' are not included in the payload
      // This is effectively done by not adding them to 'updatedEvent'
    } else {
      // If not removing the image and no new image is selected, retain the original image data
      if (originalImage) updatedEvent.image = originalImage;
      if (originalThumbnail) updatedEvent.thumbnail = originalThumbnail;
    }

    // Proceed with event update
    try {
      const result = await updateEvent(updatedEvent);
      if (!result.error) {
        toast.success("Event updated successfully");
        navigate("/admin/event/list");
      } else {
        throw new Error("Update failed: " + result.error.message);
      }
    } catch (error) {
      toast.error(
        "Failed to update event: " + (error?.data?.message || error.error)
      );
      console.error(error?.data?.message || error.error);
    }
  };

  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleRemoveImageChange = (e) => {
    setRemoveImage(e.target.checked);
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
                  rows={8}
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group className="pb-3" controlId="image">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  label="Choose New Image (optional)"
                  onChange={imageHandler}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="removeImage">
                <Form.Check
                  type="checkbox"
                  label="Remove Image"
                  checked={removeImage}
                  onChange={handleRemoveImageChange}
                />
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
