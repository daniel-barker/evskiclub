import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import FormContainer from "../../components/FormContainer";
import Editor from "../../components/Editor";
import {
  useGetPostByIdQuery,
  useAdminUpdatePostMutation,
  useUploadPostImageMutation,
} from "../../slices/postApiSlice";
import { toast } from "react-toastify";

const BBEditScreen = () => {
  const { id: postId } = useParams();
  console.log(postId);
  const navigate = useNavigate();

  const {
    data: post,
    isLoading,
    isError,
    refetch,
  } = useGetPostByIdQuery(postId);
  console.log(post);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [removeImage, setRemoveImage] = useState(false);

  const [updatePost, { isLoading: loadingUpdate }] =
    useAdminUpdatePostMutation();
  const [uploadImage, { isLoading: loadingUpload }] =
    useUploadPostImageMutation();

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
      setStatus(post.status);
      setImage(post.image);
      setThumbnail(post.thumbnail);
    }
  }, [post]);

  const submitHandler = async (e) => {
    e.preventDefault();

    let imageUrl = image;
    let thumbnailUrl = thumbnail;

    // If a new image is uploaded
    if (image && typeof image === "object") {
      const formData = new FormData();
      formData.append("image", image);

      try {
        const uploadResult = await uploadImage(formData).unwrap();
        imageUrl = uploadResult.image; // Get the uploaded image URL
        thumbnailUrl = uploadResult.thumbnail; // Get the uploaded thumbnail URL
      } catch (error) {
        toast.error("Image upload failed");
        return; // Prevent post update if image upload fails
      }
    }

    if (removeImage) {
      imageUrl = "";
      thumbnailUrl = "";
    }

    try {
      const updatedPost = {
        _id: postId,
        title,
        body,
        status,
        image: imageUrl,
        thumbnail: thumbnailUrl,
      };

      await updatePost(updatedPost);
      toast.success("Post updated successfully");
      navigate("/admin/bb");
    } catch (error) {
      toast.error("Error updating the post");
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
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

  if (loadingUpdate || loadingUpload) {
    return <Loader />;
  }

  return (
    <Container>
      <Link to="/admin/bb" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Post</h1>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Message variant="danger">{isError}</Message>
        ) : (
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

            {/* Use Bootstrap Grid to align image and new image next to each other */}
            <Row>
              <Col md={6}>
                {image && (
                  <Form.Group controlId="image">
                    <Form.Label>Current Image</Form.Label>
                    <div>
                      <img src={`/${post.thumbnail}`} alt={title} width={100} />
                    </div>
                  </Form.Group>
                )}
              </Col>

              <Col md={6}>
                <Form.Group controlId="new-image">
                  <Form.Label>
                    <h5>
                      <strong>New Image</strong>
                    </h5>{" "}
                    <h6>(optional)</h6>
                  </Form.Label>
                  <Form.Control
                    type="file"
                    label="new image"
                    onChange={imageHandler}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="removeImage">
              <Form.Check
                type="checkbox"
                label="Remove Image"
                checked={removeImage}
                onChange={handleRemoveImageChange}
              />
            </Form.Group>
            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <div>
                <Button
                  type="button"
                  variant={status === "pending" ? "secondary" : "light"}
                  onClick={() => handleStatusChange("pending")}
                >
                  Pending
                </Button>{" "}
                <Button
                  type="button"
                  variant={status === "approved" ? "success" : "light"}
                  onClick={() => handleStatusChange("approved")}
                >
                  Approve
                </Button>{" "}
                <Button
                  type="button"
                  variant={status === "rejected" ? "danger" : "light"}
                  onClick={() => handleStatusChange("rejected")}
                >
                  Reject
                </Button>
              </div>
            </Form.Group>

            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </Container>
  );
};

export default BBEditScreen;
