import { useState } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useGetPublishedNewsQuery } from "../slices/newsApiSlice";
import DOMPurify from "dompurify";

const NewsScreen = () => {
  const { data: news, isLoading, isError } = useGetPublishedNewsQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const itemsPerPage = 5;

  const totalPages = news ? Math.ceil(news.length / itemsPerPage) : 1;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = news?.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const formatDate = (datetime) => {
    const date = new Date(datetime).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return date;
  };

  // Handle opening the modal with the clicked image
  const handleImageClick = (image) => {
    setModalImage(image); // Set the clicked image to be shown in modal
    setShowModal(true); // Show the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  if (isLoading) return <Loader />;
  if (isError) return <Message variant="danger">Error fetching news</Message>;

  return (
    <Container>
      <Row className="align-items-center pt-4 pb-3">
        <Col className="text-center">
          <h1>Club News</h1>
        </Col>
      </Row>
      {currentNews.map((post) => (
        <Card key={post._id} className="news-card my-3 p-3 rounded shadow-sm">
          <Row className="g-0">
            {/* Text content */}
            <Col md={post.image ? 7 : 12}>
              <div className="news-card-body">
                <Card.Title className="news-card-title">
                  {post.title}
                </Card.Title>
                {/* Move the date right under the title */}
                <div className="news-card-date">
                  {formatDate(post.createdAt)}
                </div>
                <hr />
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.post),
                  }}
                />
              </div>
            </Col>

            {/* Image content */}
            {post.image && (
              <Col md={5} className="news-card-image-container">
                <img
                  src={post.image}
                  alt={post.title}
                  className="img-fluid rounded news-card-image"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleImageClick(post.image)}
                />
              </Col>
            )}
          </Row>
        </Card>
      ))}
      {/* Modal to display full-size image */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        size="lg"
        dialogClassName="custom-modal"
      >
        <Modal.Body className="p-0">
          {/* Close button */}
          <Button className="news-modal-close" onClick={handleCloseModal}>
            &times;
          </Button>
          <img
            src={modalImage}
            alt="Full-size Image"
            className="img-fluid rounded"
          />
        </Modal.Body>
      </Modal>
      {/* Pagination */}
      <Row className="d-flex justify-content-center m-4">
        <Col xs="auto">
          <Button
            variant="primary"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>
        </Col>
        <Col xs="auto" className="d-flex align-items-center">
          <span>
            Page {currentPage} of {totalPages}
          </span>
        </Col>
        <Col xs="auto">
          <Button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NewsScreen;
