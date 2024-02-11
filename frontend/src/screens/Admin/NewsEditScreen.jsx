import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import {
  useGetNewsByIdQuery,
  useUpdateNewsMutation,
  useUploadNewsImageMutation,
} from "../../slices/newsApiSlice";

const NewsEditScreen = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [post, setPost] = useState("");
  const [image, setImage] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const { data: news, isLoading, error } = useGetNewsByIdQuery(id);

  const [updateNews, { isLoading: loadingUpdate }] = useUpdateNewsMutation();

  const [uploadImage, { isLoading: loadingUpload }] =
    useUploadNewsImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (news) {
      setTitle(news.title);
      setPost(news.post);
      setImage(news.image);
      setThumbnail(news.thumbnail);
      setIsPublished(news.isPublished);
    }
  }, [news]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const updatedNews = {
      id,
      title,
      post,
      image,
      thumbnail,
      isPublished,
    };
    try {
      const result = await updateNews(updatedNews);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("News updated successfully");
        navigate("/admin/news/list");
      }
    } catch (error) {
      toast.error(error.message);
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
          <Link to="/admin/news/list" className="btn btn-light my-3">
            Go Back
          </Link>
          <FormContainer>
            <h1 className="text-center">Edit News</h1>
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
                  rows={10}
                  placeholder="Enter post"
                  value={post}
                  onChange={(e) => setPost(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="isPublished">
                <Form.Check
                  type="checkbox"
                  label="Published"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                ></Form.Check>
              </Form.Group>

              <Form.Group className="pb-3" controlId="image">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  label="Choose File"
                  onChange={uploadFileHandler}
                ></Form.Control>
                {loadingUpload && <Loader />}
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
export default NewsEditScreen;
