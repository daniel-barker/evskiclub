import { Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetAllPostsQuery } from "../../slices/postApiSlice";
import DOMPurify from "dompurify";

const BulletinBoard = () => {
  const { data: posts, isLoading, isError } = useGetAllPostsQuery();

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
  if (isError) return <p>Error fetching posts</p>;

  return (
    <>
      <Container className="news-screen-container">
        <Link to="/" className="btn btn-secondary my-3">
          Go Back
        </Link>
        <Row>
          <Col>
            <h1 className="text-center">Bulletin Board</h1>
          </Col>
        </Row>
        {posts.map((post) => (
          <Row key={post._id} className="mb-4">
            <Col>
              <h2>{post.title}</h2>
              <p className="news-screen-date">{formatDate(post.createdAt)}</p>
              {/* Safely render HTML content */}
              <div
                className="news-screen-content"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(post.body),
                }}
              />
              {post.image && <img src={post.image} alt={post.title} />}
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
export default BulletinBoard;
