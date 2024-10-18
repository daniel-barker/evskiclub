import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Container,
  Row,
  Col,
  Modal,
} from "react-bootstrap";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import FormContainer from "../../components/FormContainer";
import Editor from "../../components/Editor";
import {
  useGetPostByIdQuery,
  useUpdatePostAsAdminMutation,
  useUploadPostImageMutation,
} from "../../slices/postApiSlice";
import { toast } from "react-toastify";

const BBEditScreen = () => {
  const { id: postId } = useParams();
  const navigate = useNavigate();

  const {
    data: post,
    isLoading,
    isError,
    refetch,
  } = useGetPostByIdQuery(postId);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [imagePreview, setImagePreview] = useState(""); // Local image preview
  const [showModal, setShowModal] = useState(false); // Modal state
  const [removeImage, setRemoveImage] = useState(false);

  const [updatePost, { isLoading: loadingUpdate }] =
    useUpdatePostAsAdminMutation();
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

  // Handle file selection and show local preview
  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Save the file object

      // Use FileReader to generate a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set local preview URL
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle Modal
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Handle image removal and immediately update the post in the database
  const handleRemoveImage = async () => {
    try {
      const updatedPost = {
        _id: postId,
        title,
        body,
        status,
        image: "", // Clear the image
        thumbnail: "", // Clear the thumbnail
      };

      await updatePost(updatedPost).unwrap();
      toast.success("Image removed successfully");

      // Update the local state
      setImage("");
      setThumbnail("");
      setImagePreview(""); // Remove local preview
    } catch (error) {
      toast.error("Error removing the image");
    }
  };

  if (loadingUpdate || loadingUpload) return <Loader />;

  return (
    <Container>
      <FormContainer>
        <h1>Edit Post</h1>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Message variant="danger">{isError}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Row className="align-items-center">
              <Col md={11}>
                <Form.Group controlId="status">
                  <ToggleButtonGroup
                    type="radio"
                    name="status"
                    value={status}
                    onChange={handleStatusChange}
                  >
                    <ToggleButton
                      id="toggle-pending"
                      variant={
                        status === "pending" ? "warning" : "outline-warning"
                      }
                      value="pending"
                    >
                      Pending
                    </ToggleButton>
                    <ToggleButton
                      id="toggle-approved"
                      variant={
                        status === "approved" ? "success" : "outline-success"
                      }
                      value="approved"
                    >
                      Approved
                    </ToggleButton>
                    <ToggleButton
                      id="toggle-rejected"
                      variant={
                        status === "rejected" ? "danger" : "outline-danger"
                      }
                      value="rejected"
                    >
                      Rejected
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Form.Group>
              </Col>
              <Col md={1}>
                <Button type="submit" variant="primary">
                  Update
                </Button>
              </Col>
            </Row>
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

            {/* Image and thumbnail handling */}
            <Row className="justify-content-center mt-3">
              {imagePreview ? (
                <Col md={6} className="d-flex flex-column align-items-center">
                  <Form.Group controlId="image">
                    <Form.Label>Image Preview</Form.Label>
                    <div>
                      <img src={imagePreview} alt="Preview" width={300} />
                    </div>
                  </Form.Group>
                </Col>
              ) : (
                image && (
                  <Col md={6} className="d-flex flex-column align-items-center">
                    <Form.Group controlId="image">
                      <Form.Label>Current Image</Form.Label>
                      <div>
                        <img
                          src={`/${post.thumbnail}`}
                          alt={title}
                          width={300}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                )
              )}

              {/* Always show the buttons */}
              <Col
                md={6}
                className="d-flex flex-column justify-content-center align-items-center"
              >
                <Button
                  variant="danger"
                  onClick={handleRemoveImage}
                  className="mt-3"
                  disabled={!image && !imagePreview} // Disable if no image exists
                >
                  Remove Image
                </Button>
                <Button
                  variant="primary"
                  onClick={handleShowModal}
                  className="mt-3"
                >
                  {image || imagePreview ? "Update Image" : "Add Image"}
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </FormContainer>

      {/* Modal for image upload */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {image || imagePreview ? "Update Image" : "Add Image"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="new-image">
            <Form.Label>Choose an image</Form.Label>
            <Form.Control type="file" onChange={imageHandler} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BBEditScreen;
