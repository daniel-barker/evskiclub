import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
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
  const [errors, setErrors] = useState({}); // State to track form errors

  const [createPost, { isLoading: loadingCreate }] = useCreatePostMutation();
  const [uploadImage, { isLoading: loadingUpload }] =
    useUploadPostImageMutation();

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!body.trim()) newErrors.body = "Body is required";
    return newErrors;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return; // Stop the form submission
    }

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
            isInvalid={!!errors.title} // Highlight input if error
          />
          <Form.Control.Feedback type="invalid">
            {errors.title}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="body">
          <Form.Label className="mt-2">Body</Form.Label>
          <Editor content={body} setContent={setBody} />
          {errors.body && <p className="text-danger">{errors.body}</p>}
        </Form.Group>

        <Form.Group controlId="image">
          <Form.Label className="mt-2">Choose Image (optional)</Form.Label>
          <Form.Control
            type="file"
            id="image-file"
            label="Choose Image"
            onChange={imageHandler}
          ></Form.Control>
        </Form.Group>

        <Button className="mt-3" type="submit" variant="primary">
          Create
        </Button>
      </Form>
    </FormContainer>
  );
};
export default CreatePost;
