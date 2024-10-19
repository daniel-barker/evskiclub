import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import Message from "../../components/Message";
import Editor from "../../components/Editor";
import {
  useGetNewsByIdQuery,
  useUpdateNewsMutation,
  useUploadNewsImageMutation,
} from "../../slices/newsApiSlice";

const NewsEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [post, setPost] = useState(""); // State for the CKEditor content
  const [image, setImage] = useState("");
  const [originalImage, setOriginalImage] = useState(""); // Store original image URL
  const [originalThumbnail, setOriginalThumbnail] = useState(""); // Store original thumbnail URL
  const [removeImage, setRemoveImage] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const { data: news, isLoading, error } = useGetNewsByIdQuery(id);
  const [updateNews, { isLoading: loadingUpdate }] = useUpdateNewsMutation();
  const [uploadImage, { isLoading: loadingUpload }] =
    useUploadNewsImageMutation();

  useEffect(() => {
    if (news) {
      setTitle(news.title);
      setPost(news.post); // Initialize editor with existing post content
      setOriginalImage(news.image);
      setOriginalThumbnail(news.thumbnail);
      setIsPublished(news.isPublished);
    }
  }, [news]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const updatedNews = {
      id,
      title,
      post,
      isPublished,
    };

    if (!removeImage && image instanceof File) {
      try {
        const formData = new FormData();
        formData.append("image", image);
        const uploadResult = await uploadImage(formData).unwrap();
        updatedNews.image = uploadResult.image;
        console.log("Upload result: ", uploadResult);
        updatedNews.thumbnail = uploadResult.thumbnail;
      } catch (error) {
        toast.error(
          "Image upload failed: " + (error?.data?.message || error.message)
        );
        return;
      }
    } else if (removeImage) {
      // Leave blank to remove the image from the news post
    } else {
      // Retain original images
      if (originalImage) updatedNews.image = originalImage;
      if (originalThumbnail) updatedNews.thumbnail = originalThumbnail;
    }

    // Update the post
    try {
      const result = await updateNews(updatedNews);
      if (!result.error) {
        toast.success("News updated successfully");
        navigate("/admin/news/list");
      } else {
        throw new Error("News update failed");
      }
    } catch (error) {
      toast.error(
        "News update failed: " + (error?.data?.message || error.message)
      );
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
                {/* Use the Editor component here */}
                <Editor content={post} setContent={setPost} />
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

export default NewsEditScreen;
