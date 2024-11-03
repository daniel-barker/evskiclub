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
  useUploadNewsPDFMutation,
} from "../../slices/newsApiSlice";

const NewsCreateScreen = () => {
  const [title, setTitle] = useState("");
  const [post, setPost] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [image, setImage] = useState("");
  const [pdf, setPdf] = useState(""); // New state for the PDF file

  const [createNews, { isLoading: loadingCreate }] = useCreateNewsMutation();
  const [uploadImage, { isLoading: loadingUpload }] =
    useUploadNewsImageMutation();
  const [uploadPDF, { isLoading: loadingPDF }] = useUploadNewsPDFMutation(); // Hook for PDF upload

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    let newNews = {
      title,
      post,
      isPublished,
    };

    try {
      // If an image is selected
      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        const uploadResult = await uploadImage(formData).unwrap();
        newNews.image = uploadResult.image;
        newNews.thumbnail = uploadResult.thumbnail;
      }

      // If a PDF is selected
      if (pdf) {
        const pdfFormData = new FormData();
        pdfFormData.append("pdf", pdf);

        const pdfUploadResult = await uploadPDF(pdfFormData).unwrap();
        newNews.pdf = pdfUploadResult.pdf; // Assuming API response includes 'pdf' URL
      }

      // Create news with image, pdf, and other fields
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
  };

  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const pdfHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdf(file);
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
        {(loadingUpload || loadingPDF) && <Loader />}
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
            <Form.Label htmlFor="post">Post</Form.Label>{" "}
            <Editor id="post" content={post} setContent={setPost} />
          </Form.Group>

          <Form.Group controlId="isPublished">
            <Form.Check
              type="checkbox"
              label="Publish"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            ></Form.Check>
          </Form.Group>

          {/* Image upload */}
          <Form.Group controlId="image">
            <Form.Label>Choose Image (optional)</Form.Label>
            <Form.Control
              type="file"
              id="image-file"
              label="Choose Image"
              onChange={imageHandler}
            ></Form.Control>
          </Form.Group>

          {/* PDF upload */}
          <Form.Group controlId="pdf" className="mt-3">
            <Form.Label>Choose PDF (optional)</Form.Label>
            <Form.Control
              type="file"
              id="pdf-file"
              label="Choose PDF"
              accept="application/pdf"
              onChange={pdfHandler}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" className="mt-3">
            Create
          </Button>
        </Form>
      </FormContainer>
    </Container>
  );
};
export default NewsCreateScreen;
