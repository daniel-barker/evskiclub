import { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import Message from "../../components/Message";
import Editor from "../../components/Editor";
import {
  useGetNewsByIdQuery,
  useUpdateNewsMutation,
  useUploadNewsImageMutation,
  useUploadNewsPDFMutation,
} from "../../slices/newsApiSlice";

const NewsEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [post, setPost] = useState("");
  const [image, setImage] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [pdf, setPdf] = useState("");
  const [originalImage, setOriginalImage] = useState("");
  const [originalThumbnail, setOriginalThumbnail] = useState("");
  const [originalPdf, setOriginalPdf] = useState("");
  const [removeImage, setRemoveImage] = useState(false);
  const [removePdf, setRemovePdf] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [showModal, setShowModal] = useState(false); // Modal for image upload currently unused until button reimplementation
  const [initialState, setInitialState] = useState({});

  const { data: news, isLoading, error } = useGetNewsByIdQuery(id);
  const [updateNews, { isLoading: loadingUpdate }] = useUpdateNewsMutation();
  const [uploadImage, { isLoading: loadingUpload }] =
    useUploadNewsImageMutation();
  const [uploadPDF, { isLoading: loadingPDF }] = useUploadNewsPDFMutation();

  useEffect(() => {
    if (news) {
      setTitle(news.title);
      setPost(news.post);
      setOriginalImage(news.image);
      setOriginalThumbnail(news.thumbnail);
      setOriginalPdf(news.pdf);
      setIsPublished(news.isPublished);
      setInitialState({
        title: news.title,
        post: news.post,
        image: news.image,
        thumbnail: news.thumbnail,
        pdf: news.pdf,
        isPublished: news.isPublished,
      });
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

    // Image upload logic
    if (removeImage) {
      updatedNews.image = "";
      updatedNews.thumbnail = "";
    } else if (image instanceof File) {
      try {
        const formData = new FormData();
        formData.append("image", image);
        const uploadResult = await uploadImage(formData).unwrap();
        updatedNews.image = uploadResult.image;
        updatedNews.thumbnail = uploadResult.thumbnail;
      } catch (error) {
        toast.error(
          "Image upload failed: " + (error?.data?.message || error.message)
        );
        return;
      }
    } else {
      if (originalImage) updatedNews.image = originalImage;
      if (originalThumbnail) updatedNews.thumbnail = originalThumbnail;
    }

    // PDF upload logic
    if (removePdf) {
      updatedNews.pdf = ""; // Clear the PDF if marked for removal
    } else if (pdf instanceof File) {
      try {
        const formData = new FormData();
        formData.append("pdf", pdf);
        const uploadResult = await uploadPDF(formData).unwrap();
        updatedNews.pdf = uploadResult.pdf;
      } catch (error) {
        toast.error(
          "PDF upload failed: " + (error?.data?.message || error.message)
        );
        return;
      }
    } else {
      if (originalPdf) updatedNews.pdf = originalPdf; // Retain original PDF if not removed
    }

    try {
      const result = await updateNews(updatedNews);
      if (!result.error) {
        toast.success("News updated successfully");
        navigate("/admin/news/list");
        setRemoveImage(false); // Reset after successful update
        setRemovePdf(false); // Reset after successful update
      } else {
        throw new Error("News update failed");
      }
    } catch (error) {
      toast.error(
        "News update failed: " + (error?.data?.message || error.message)
      );
    }
  };

  const hasChanges = useCallback(() => {
    return (
      title !== initialState.title ||
      post !== initialState.post ||
      (removeImage && originalImage) ||
      (removePdf && originalPdf) || // Check for removePdf change
      isPublished !== initialState.isPublished
    );
  }, [
    title,
    post,
    removeImage,
    removePdf, // Include removePdf in dependency array
    isPublished,
    initialState,
    originalImage,
    originalPdf,
  ]);

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

  // Handle PDF selection
  const pdfHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdf(file); // Save the PDF file object
    }
  };

  // Toggle Modal
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleRemoveImageChange = (e) => {
    setRemoveImage(e.target.checked);
  };

  const handleRemovePdfChange = (e) => {
    setRemovePdf(e.target.checked); // Handle PDF removal
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
                  originalImage &&
                  !removeImage && ( // Show only if image is not marked for removal
                    <Col
                      md={6}
                      className="d-flex flex-column align-items-center"
                    >
                      <Form.Group controlId="image">
                        <Form.Label>Current Image</Form.Label>
                        <div>
                          <img
                            src={`/${originalThumbnail}`}
                            alt="Current Thumbnail"
                            width={300}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  )
                )}
              </Row>

              {/* PDF handling */}
              <Row className="justify-content-center mt-3">
                {originalPdf && !removePdf && (
                  <Col md={6} className="d-flex flex-column align-items-center">
                    <Form.Group controlId="pdf">
                      <div>
                        <a
                          href={`/${originalPdf}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Current PDF
                        </a>
                      </div>
                    </Form.Group>
                  </Col>
                )}

                <Col
                  md={6}
                  className="d-flex flex-column justify-content-center align-items-center"
                >
                  {/* <Button
                    variant="danger"
                    onClick={() => setRemovePdf(true)}
                    className="mt-3"
                    disabled={!originalPdf} // Disable if no PDF exists
                  >
                    Remove PDF
                  </Button> */}
                </Col>
              </Row>

              <Form.Group className="pb-3" controlId="image">
                <Form.Label>Choose New Image (optional)</Form.Label>
                <Form.Control
                  type="file"
                  label="Choose New Image (optional)"
                  onChange={imageHandler}
                ></Form.Control>
              </Form.Group>

              <Form.Group className="pb-3" controlId="pdf">
                <Form.Label>Choose New PDF (optional)</Form.Label>
                <Form.Control
                  type="file"
                  label="Choose New PDF (optional)"
                  accept="application/pdf"
                  onChange={pdfHandler}
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

              <Form.Group controlId="removePdf">
                <Form.Check
                  type="checkbox"
                  label="Remove PDF"
                  checked={removePdf}
                  onChange={handleRemovePdfChange}
                />
              </Form.Group>

              {loadingUpload || loadingPDF ? <Loader /> : null}
              <Button
                type="submit"
                variant="primary"
                onClick={submitHandler}
                disabled={!hasChanges()}
              >
                Update
              </Button>
            </Form>
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
      )}
    </>
  );
};

export default NewsEditScreen;
