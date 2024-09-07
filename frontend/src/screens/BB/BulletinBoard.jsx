import { useState } from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetAllPostsQuery } from "../../slices/postApiSlice";
import DOMPurify from "dompurify";

const BulletinBoard = () => {
  const { data: posts, isLoading, isError } = useGetAllPostsQuery();
  const [expandedPostIds, setExpandedPostIds] = useState([]); // State to track expanded posts

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

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching posts</p>;

  return (
    <Container>
      <Link to="/" className="btn btn-primary my-3">
        Go Back
      </Link>
      <Row className="align-items-center pt-2 pb-5">
        <Col>
          <h1 className="text-center">Bulletin Board</h1>
        </Col>
      </Row>
      {posts.map((post) => (
        <div key={post._id}>
          <hr />
          <Row className="my-2 text-center">
            <Col md={1}>
              {post.image && (
                <img src={post.thumbnail} alt={post.title} width={50} />
              )}
            </Col>
            <Col md={10}>
              <Row>
                <h2>{post.title}</h2>
                <div className="news-screen-date">
                  {post.user && post.user.name}
                  <p>{formatDate(post.createdAt)}</p>
                </div>
                <div className="text-end"></div>
              </Row>
              {expandedPostIds.includes(post._id) && (
                <div
                  className="news-screen-content"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.body),
                  }}
                />
              )}
              <Button variant="link" onClick={() => togglePostBody(post._id)}>
                {expandedPostIds.includes(post._id) ? "Collapse" : "Read"}
              </Button>
            </Col>
          </Row>
        </div>
      ))}
    </Container>
  );
};

export default BulletinBoard;
