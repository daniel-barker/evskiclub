import { Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetPublishedNewsQuery } from "../slices/newsApiSlice";

const NewsScreen = () => {
  const { data: news, isLoading, isError } = useGetPublishedNewsQuery();

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

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching news</p>;

  return (
    <>
      <Container className="news-screen-container">
        <Link to="/" className="btn btn-secondary my-3">
          Go Back
        </Link>
        <Row>
          <Col>
            <h1 className="text-center">Club News</h1>
          </Col>
        </Row>
        {news.map((post) => (
          <Row key={post._id} className="mb-4">
            <Col>
              <h2>{post.title}</h2>
              <p className="news-screen-date">{formatDate(post.createdAt)}</p>
              <p className="news-screen-content">{post.post}</p>
              <div className="text-end">
                <div className="news-card-signature">
                  -{post.user && post.user.name}
                </div>
                <div className="news-card-sig-position">
                  {post.user && post.user.position}
                </div>
              </div>
            </Col>
          </Row>
        ))}
      </Container>
    </>
  );
};
export default NewsScreen;
