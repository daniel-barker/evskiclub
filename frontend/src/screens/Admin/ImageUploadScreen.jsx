import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import { useUploadImageMutation } from "../../slices/imageApiSlice";

const ImageUploadScreen = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [carousel, setCarousel] = useState(false);

  const [uploadImage, { isLoading }] = useUploadImageMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    const tagArray = tags.split(", ").filter((tag) => tag.trim() !== "");
    formData.append("tags", JSON.stringify(tagArray));
    formData.append("image", image);
    formData.append("carousel", carousel);

    try {
      const res = await uploadImage(formData).unwrap();
      toast.success(res.message);
      navigate("/gallery");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.log(err);
    }
  };

  const uploadFileHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <>
      <Container>
        <Link to="/" className="btn btn-primary my-3" variant="primary">
          Go Back
        </Link>
      </Container>
      <FormContainer>
        <h1>Upload Image</h1>
        {isLoading && <Loader />}
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

          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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

          <Form.Group controlId="image">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              label="Choose File"
              onChange={uploadFileHandler}
            ></Form.Control>
          </Form.Group>

          <Row className="align-items-center">
            <Form.Group as={Col} className="text-left mt-sm-3 mt-md-3">
              <Button type="submit" variant="primary">
                Upload
              </Button>
            </Form.Group>

            <Form.Group
              as={Col}
              controlId="carousel"
              className="mt-sm-3 mt-md-3 text-right"
            >
              <Form.Check
                type="checkbox"
                label="Include in Carousel"
                checked={carousel}
                onChange={(e) => setCarousel(e.target.checked)}
              />
            </Form.Group>
          </Row>
        </Form>
      </FormContainer>
    </>
  );
};

export default ImageUploadScreen;
