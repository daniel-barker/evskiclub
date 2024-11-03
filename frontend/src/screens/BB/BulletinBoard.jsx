import { useState } from "react";
import { Row, Col, Container, Card, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetApprovedPostsQuery } from "../../slices/postApiSlice";
import DOMPurify from "dompurify";
import "photoswipe/dist/photoswipe.css";

const BulletinBoard = () => {
  const { data: posts, isLoading, isError } = useGetApprovedPostsQuery();
  const [expandedPostIds, setExpandedPostIds] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal state
  const [modalImage, setModalImage] = useState(""); // Image to display in modal

  const formatDate = (datetime) => {
    const date = new Date(datetime).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return date;
  };

  const togglePostBody = (id) => {
    setExpandedPostIds((prevExpandedPostIds) =>
      prevExpandedPostIds.includes(id)
        ? prevExpandedPostIds.filter((postId) => postId !== id)
        : [...prevExpandedPostIds, id]
    );
  };

  const handleImageClick = (image) => {
    setModalImage(image); // Set image for the modal
    setShowModal(true); // Open modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close modal
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching posts</p>;

  return (
    <Container>
      <Row className="align-items-center my-4">
        <Col className="text-center">
          <h1 className="display-6 fw-bold">Bulletin Board</h1>
          <p className="text-muted">
            Find the latest announcements and posts from the community
          </p>
        </Col>
      </Row>
      <div className="d-flex justify-content-start mb-4">
        <Link to="/bb/mine" className="btn btn-primary me-2">
          My Posts
        </Link>
        <Link to="/bb/create" className="btn btn-outline-primary-custom">
          Create Post
        </Link>
      </div>

      {posts.map((post) => (
        <Card key={post._id} className="mb-4 shadow-sm rounded-3">
          <Row className="g-0">
            {post.image && (
              <Col
                md={4}
                className="d-flex justify-content-center align-items-center"
              >
                <img
                  src={post.thumbnail} // Display thumbnail in the card
                  alt={post.title}
                  className="img-fluid rounded-start"
                  style={{
                    cursor: "pointer",
                    maxHeight: "200px",
                    objectFit: "cover",
                    width: "100%",
                  }}
                  onClick={() => handleImageClick(post.image)} // Open modal with full-size image
                />
              </Col>
            )}
            <Col md={post.image ? 8 : 12}>
              <Card.Body>
                <h2 className="h4 fw-bold mb-2">{post.title}</h2>
                <p className="text-muted small mb-3">
                  {post.user && post.user.name} • {formatDate(post.createdAt)}
                </p>
                <div className="bulletin-content mb-3">
                  {expandedPostIds.includes(post._id) ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(post.body),
                      }}
                    />
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          post.body.substring(0, 100) + "..."
                        ),
                      }}
                    />
                  )}
                </div>
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => togglePostBody(post._id)}
                >
                  {expandedPostIds.includes(post._id)
                    ? "Collapse"
                    : "Read More"}
                </Button>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      ))}

      {/* Modal for Enlarged Image */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Body className="p-0">
          <Button
            variant="light"
            onClick={handleCloseModal}
            className="news-modal-close"
            style={{
              fontSize: "1.5rem",
              background: "rgba(0, 0, 0, 0.5)",
              color: "#fff",
              border: "none",
              zIndex: 1000,
            }}
          >
            &times;
          </Button>
          <img
            src={modalImage} // Full-size image in modal
            alt="Enlarged"
            className="img-fluid rounded"
            style={{ maxHeight: "80vh", objectFit: "contain", width: "100%" }}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default BulletinBoard;
