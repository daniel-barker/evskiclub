import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import Editor from "../../components/Editor";
import { toast } from "react-toastify";
import {
  useCreateNewsMutation,
  useUploadNewsImageMutation,
} from "../../slices/newsApiSlice";

const NewsCreateScreen = () => {
  const [title, setTitle] = useState("");
  const [post, setPost] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [image, setImage] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const [createNews, { isLoading: loadingCreate }] = useCreateNewsMutation();
  const [uploadImage, { isLoading: loadingUpload }] =
    useUploadNewsImageMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (image) {
      const formData = new FormData();
      formData.append("image", image);

      try {
        const uploadResult = await uploadImage(formData).unwrap();

        const newNews = {
          title,
          post,
          image: uploadResult.image,
          thumbnail: uploadResult.thumbnail,
          isPublished,
        };

        const createResult = await createNews(newNews);
        if (createResult.data) {
          toast.success("News created successfully");
          navigate("/admin/news/list");
        } else {
          throw new Error("News creation failed");
        }
      } catch (error) {
        toast.error(
          error?.data?.message ||
            error.error ||
            "An error occurred during upload or news creation."
        );
      }
    } else {
      //handle news without images
      try {
        const newNews = { title, post, isPublished };
        const createResult = await createNews(newNews);
        if (createResult.data) {
          toast.success("News created successfully");
          navigate("/admin/news/list");
        } else {
          throw new Error("News creation failed");
        }
      } catch (error) {
        toast.error(
          error?.data?.message ||
            error.error ||
            "An error occurred during news creation."
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
      <Link to="/admin/news/list" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1 className="text-center">Create News Post</h1>
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

          <Form.Group controlId="post" className="mt-3">
            <Form.Label>Post</Form.Label>
            <Editor content={post} setContent={setPost} />
          </Form.Group>
          <Form.Group controlId="isPublished">
            <Form.Check
              type="checkbox"
              label="Publish"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            ></Form.Check>
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
export default NewsCreateScreen;
