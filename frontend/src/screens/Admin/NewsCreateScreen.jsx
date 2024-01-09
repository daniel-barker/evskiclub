import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
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
    const newNews = {
      title,
      post,
      image,
      thumbnail,
      isPublished,
    };
    try {
      const result = await createNews(newNews);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("News created successfully");
        navigate("/admin/news/list");
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
    <Container>
      <Link to="/admin/news/list" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <div className="form-background">
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

            <Form.Group controlId="post">
              <Form.Label>Post</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                placeholder="Enter post"
                value={post}
                onChange={(e) => setPost(e.target.value)}
              ></Form.Control>
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
export default NewsCreateScreen;
