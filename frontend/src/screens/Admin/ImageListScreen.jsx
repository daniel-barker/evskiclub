import React, { useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Table, Button, Container, Row, Col, Form } from "react-bootstrap";
import { FaTrash, FaEdit } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useGetImagesQuery,
  useDeleteImageMutation,
} from "../../slices/imageApiSlice";

const ImageListScreen = () => {
  const { data: images, refetch, isLoading, error } = useGetImagesQuery();
  const [deleteImage, { isLoading: loadingDelete }] = useDeleteImageMutation();

  const [titleFilter, setTitleFilter] = useState("");
  const [carouselFilter, setCarouselFilter] = useState(""); // "" for all, "yes" for Yes, "no" for No

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete an image?")) {
      try {
        await deleteImage(id);
        toast.success("Image deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  // Filter images based on title and carousel status
  const filteredImages = images?.filter(
    (image) =>
      image.title.toLowerCase().includes(titleFilter.toLowerCase()) &&
      (carouselFilter === "" ||
        (carouselFilter === "yes" && image.carousel) ||
        (carouselFilter === "no" && !image.carousel))
  );

  return (
    <Container className="mt-4 form-background">
      <Row className="align-items-center">
        <Col>
          <h1>Images</h1>
        </Col>
        <Col xs="auto" className="text-end">
          <Link to="/admin/images/upload" className="btn btn-primary">
            <FaEdit /> Upload Image
          </Link>
        </Col>
      </Row>

      {/* Filter Controls */}
      <Row className="my-3">
        <Col md={5}>
          <Form.Control
            type="text"
            placeholder="Filter by Title"
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
          />
        </Col>
        <Col md={5}>
          <Form.Select
            value={carouselFilter}
            onChange={(e) => setCarouselFilter(e.target.value)}
          >
            <option value="">All Carousel Status</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </Form.Select>
        </Col>
      </Row>

      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table
          striped
          hover
          responsive
          className="table-sm text-center mx-auto"
        >
          <thead>
            <tr>
              <th className="fs-5">IMAGE</th>
              <th className="fs-5">TITLE</th>
              <th className="fs-5">TAGS</th>
              <th className="fs-5">CAROUSEL</th>
              <th className="fs-5"></th>
            </tr>
          </thead>
          <tbody>
            {filteredImages.map((image) => (
              <tr key={image._id}>
                <td className="align-middle fs-5">
                  <img
                    src={`${image.thumbnail}`}
                    alt={image.title}
                    style={{ width: "200px" }}
                  />
                </td>
                <td className="align-middle fs-5">{image.title}</td>
                <td className="align-middle fs-5">{image.tags.join(", ")}</td>
                <td className="align-middle fs-5">
                  {image.carousel ? "Yes" : "No"}
                </td>
                <td className="align-middle fs-5">
                  <LinkContainer to={`/admin/images/${image._id}/edit`}>
                    <Button className="me-3">Edit</Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    onClick={() => deleteHandler(image._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ImageListScreen;
