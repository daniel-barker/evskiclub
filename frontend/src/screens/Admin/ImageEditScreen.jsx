import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
  useGetSingleImageQuery,
  useUpdateImageMutation,
} from "../../slices/imageApiSlice";

const ImageEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [carousel, setCarousel] = useState(false);

  const { data: image, isLoading, error } = useGetSingleImageQuery(id);
  const [updateImage, { isLoading: isLoadingUpdate }] =
    useUpdateImageMutation();

  useEffect(() => {
    if (image) {
      setTitle(image.title);
      setDescription(image.description);
      setTags(image.tags.join(", "));
      setCarousel(image.carousel);
    }
  }, [image]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const tagArray = tags.split(", ").filter((tag) => tag.trim() !== "");
    try {
      await updateImage({ id, title, description, tags: tagArray, carousel });
      toast.success("Image updated successfully");
      navigate("/admin/images/list");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Container>
        <Link to="/admin/images/list" className="btn btn-light my-3">
          Go Back
        </Link>
        <FormContainer>
          <h1>Edit Image</h1>
          {isLoading || isLoadingUpdate ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Form onSubmit={submitHandler}>
              {/* Form fields for title, description, tags */}
              <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="tags">
                <Form.Label>Tags</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </Form.Group>

              {/* Row for button and checkbox */}
              <Row className="align-items-center">
                <Col className="text-left mt-3">
                  <Button type="submit" variant="primary">
                    Update
                  </Button>
                </Col>

                <Col className="text-right mt-3">
                  <Form.Group controlId="carousel">
                    <Form.Check
                      type="checkbox"
                      label="Include in Carousel"
                      checked={carousel}
                      onChange={(e) => setCarousel(e.target.checked)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}
        </FormContainer>
      </Container>
    </>
  );
};

export default ImageEditScreen;
