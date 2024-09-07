import { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useGetPublishedNewsQuery } from "../slices/newsApiSlice";
import DOMPurify from "dompurify";

const NewsScreen = () => {
  const { data: news, isLoading, isError } = useGetPublishedNewsQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = news ? Math.ceil(news.length / itemsPerPage) : 1;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = news?.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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

  if (isLoading) return <Loader />;
  if (isError) return <Message variant="danger">Error fetching news</Message>;

  return (
    <Container className="mt-4">
      <Link to="/" className="btn btn-primary my-3">
        Go Back
      </Link>
      <Row className="align-items-center pt-2 pb-5">
        <Col className="text-center">
          <h1>Club News</h1>
        </Col>
      </Row>
      {currentNews.map((post) => (
        <Card key={post._id} className="my-3 p-3 rounded shadow-sm card-s">
          <Card.Title className="news-post-title text-center">
            {post.title}
          </Card.Title>
          <hr />
          <Card.Body>
            {/* Safely render HTML content */}
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.post),
              }}
            />
          </Card.Body>
          <Card.Footer className="ms-auto">
            {post.image && <img src={post.thumbnail} alt={post.title} />}
            <div className="news-card-signature">
              {post.user && post.user.name}
            </div>
            <div className="news-card-sig-position">
              {post.user && post.user.position}
            </div>
            <div className="news-card-sig-position">
              {formatDate(post.createdAt)}
            </div>
          </Card.Footer>
        </Card>
      ))}
    </Container>
  );
};
export default NewsScreen;
