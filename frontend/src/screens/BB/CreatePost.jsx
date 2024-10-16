import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import Editor from "../../components/Editor";
import { toast } from "react-toastify";
import {
  useCreatePostMutation,
  useUploadPostImageMutation,
} from "../../slices/postApiSlice";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");

  const [createPost, { isLoading: loadingCreate }] = useCreatePostMutation();
  const [uploadImage, { isLoading: loadingUpload }] =
    useUploadPostImageMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (image) {
      const formData = new FormData();
      formData.append("image", image);

      try {
        const uploadResult = await uploadImage(formData).unwrap();

        const newPost = {
          title,
          body,
          image: uploadResult.image,
          thumbnail: uploadResult.thumbnail,
        };

        const createResult = await createPost(newPost);
        if (createResult.data) {
          toast.success("Post created successfully, awaiting approval");
          navigate("/bb");
        } else {
          throw new Error("Post creation failed");
        }
      } catch (error) {
        toast.error(
          error?.data?.message ||
            error.error ||
            "An error occurred during upload or post creation."
        );
      }
    } else {
      //handle post without images
      try {
        const newPost = { title, body };
        const createResult = await createPost(newPost);
        if (createResult.data) {
          toast.success("Post created successfully");
          navigate("/bb");
        } else {
          throw new Error("Post creation failed");
        }
      } catch (error) {
        toast.error(
          error?.data?.message ||
            error.error ||
            "An error occurred during post creation."
        );
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
    <Container>
      <Link to="/posts" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Create Post</h1>
        {loadingCreate || (loadingUpload && <Loader />)}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="body">
            <Form.Label>Body</Form.Label>
            <Editor content={body} setContent={setBody} />
          </Form.Group>
          <Form.Group controlId="image">
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
export default CreatePost;
