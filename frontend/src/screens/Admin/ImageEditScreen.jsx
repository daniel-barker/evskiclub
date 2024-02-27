import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import {
  useGetSingleImageQuery,
  useUpdateImageMutation,
} from "../../slices/imageApiSlice";

const ImageEditScreen = () => {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [carousel, setCarousel] = useState(false);
  const [description, setDescription] = useState("");

  const { data: image, isLoading, error } = useGetSingleImageQuery(id);

  const [updateImage, { isLoading: loadingUpdate }] = useUpdateImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (image) {
      setTitle(image.title);
      setTags(image.tags);
      setCarousel(image.carousel);
      setDescription(image.description);
    }
  }, [image]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateImage({ id, title, tags, carousel, description });
      toast.success("Image updated successfully");
      navigate("/admin/images");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
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
          <Link to="/admin/images" className="btn btn-light my-3">
            Go Back
          </Link>
          <FormContainer>
            <h1>Edit Image</h1>
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

              <Form.Group controlId="tags">
                <Form.Label>Tags</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="carousel">
                <Form.Check
                  type="checkbox"
                  label="Carousel"
                  checked={carousel}
                  onChange={(e) => setCarousel(e.target.checked)}
                ></Form.Check>
              </Form.Group>

              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></Form.Control>
              </Form.Group>

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
export default ImageEditScreen;
