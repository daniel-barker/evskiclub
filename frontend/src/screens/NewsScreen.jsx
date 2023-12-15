import { Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import news from "./data/news.json";

const NewsScreen = () => {
  return (
    <>
      <Container rounded className="news-screen-container">
        <Link to="/" className="btn btn-secondary my-3">
          Go Back
        </Link>
        <Row>
          <Col>
            <h1 className="text-center">Club News</h1>
          </Col>
        </Row>
        {news.news.map((post) => (
          <Row key={post.id} className="mb-4">
            <Col>
              <h2>{post.title}</h2>
              <p className="news-screen-date">{post.date}</p>
              <p className="news-screen-content">{post.content}</p>
              <div className="text-end">
                <div className="news-card-signature">-{post.author}</div>
                <div className="news-card-sig-position">{post.position}</div>
              </div>
            </Col>
          </Row>
        ))}
      </Container>
    </>
  );
};
export default NewsScreen;
