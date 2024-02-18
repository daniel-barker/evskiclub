import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
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

  const [uploadImage, { isLoading }] = useUploadImageMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    const tagArray = tags.split(" ").filter((tag) => tag.trim() !== "");
    formData.append("tags", JSON.stringify(tagArray));
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await uploadImage(formData).unwrap();
      toast.success(res.message);
      navigate("/images");
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
      <Link to="/" className="btn btn-light my-3" variant="primary">
        Go Back
      </Link>
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
              id="image-file"
              label="Choose File"
              custom
              onChange={uploadFileHandler}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary">
            Upload
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ImageUploadScreen;
