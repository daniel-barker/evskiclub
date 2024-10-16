import { useState } from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa"; // Font Awesome icon for editing
import { useGetMyPostsQuery } from "../../slices/postApiSlice";
import DOMPurify from "dompurify";

const MyPosts = () => {
  const { data: posts, isLoading, isError } = useGetMyPostsQuery();
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

  // Filter out rejected posts
  const visiblePosts = posts.filter((post) => post.status !== "rejected");

  return (
    <Container>
      <div className="d-flex justify-content-between w-100">
        <Link to="/" className="btn btn-primary my-3">
          Go Back
        </Link>
        <Link to="/bb" className="btn btn-primary my-3">
          All Posts
        </Link>
        <Link to="/bb/create" className="btn btn-primary my-3">
          Create Post
        </Link>
      </div>
      <Row className="align-items-center pt-2 pb-5">
        <Col>
          <h1 className="text-center">My Posts</h1>
        </Col>
      </Row>
      {visiblePosts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        visiblePosts.map((post) => (
          <div key={post._id}>
            <hr />
            <Row className="my-2 text-center">
              <Col md={1}>
                {post.image && (
                  <img
                    src={`/${post.thumbnail}`}
                    alt={post.title}
                    width={100}
                  />
                )}
              </Col>
              <Col md={9}>
                <Row>
                  <h2>{post.title}</h2>
                  <div className="news-screen-date">
                    <p>{formatDate(post.createdAt)}</p>
                    <p>Status: {post.status}</p>
                  </div>
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
              <Col md={2}>
                {/* Edit Button */}
                <Link to={`/bb/edit/${post._id}`}>
                  <Button variant="warning" className="btn-sm">
                    <FaEdit /> Edit
                  </Button>
                </Link>
              </Col>
            </Row>
          </div>
        ))
      )}
    </Container>
  );
};

export default MyPosts;
