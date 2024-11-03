import { useState } from "react";
import { Document, Page } from "react-pdf";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useGetPublishedNewsQuery } from "../slices/newsApiSlice";
import DOMPurify from "dompurify";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const NewsScreen = () => {
  const { data: news, isLoading, isError } = useGetPublishedNewsQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
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

  const handlePDFClick = (pdf) => {
    setModalContent(
      <Document file={pdf}>
        <Page pageNumber={1} width={600} />
      </Document>
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalContent(null);
  };

  if (isLoading) return <Loader />;
  if (isError) return <Message variant="danger">Error fetching news</Message>;

  return (
    <Container>
      <Row className="align-items-center my-4">
        <Col className="text-center">
          <h2 className="display-6 fw-bold">Club News</h2>
          <p className="text-center text-muted">Newest news first</p>
        </Col>
      </Row>
      {currentNews.map((post) => (
        <Card key={post._id} className="news-card my-3 p-3 rounded shadow-sm">
          <Row className="g-0">
            <Col md={post.image || post.pdf ? 7 : 12}>
              <div className="news-card-body">
                <Card.Title className="news-card-title">
                  {post.title}
                </Card.Title>
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

            {post.image && (
              <Col md={5} className="news-card-image-container">
                <img
                  src={post.image}
                  alt={post.title}
                  className="img-fluid rounded news-card-image"
                  style={{ cursor: "pointer" }}
                  onClick={() => handlePDFClick(post.image)}
                />
              </Col>
            )}

            {post.pdf && (
              <Col md={5} className="news-card-pdf-container">
                {/* Render the first page of the PDF as a thumbnail */}
                <Document file={post.pdf}>
                  <Page pageNumber={1} width={300} />
                </Document>
                <Button
                  className="mt-3"
                  onClick={() => handlePDFClick(post.pdf)}
                >
                  View Full PDF
                </Button>
              </Col>
            )}
          </Row>
        </Card>
      ))}

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Body className="p-0">
          <Button className="news-modal-close" onClick={handleCloseModal}>
            &times;
          </Button>
          {modalContent}
        </Modal.Body>
      </Modal>

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
