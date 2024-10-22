import { useState } from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetApprovedPostsQuery } from "../../slices/postApiSlice";
import DOMPurify from "dompurify";
import { Gallery, Item } from "react-photoswipe-gallery"; // Import react-photoswipe-gallery
import "photoswipe/dist/photoswipe.css"; // Ensure the CSS for photoswipe is included

const BulletinBoard = () => {
  const { data: posts, isLoading, isError } = useGetApprovedPostsQuery();
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
      <Row className="align-items-center mt-5 mb-5">
        <Col>
          <h1 className="text-center">Bulletin Board</h1>
        </Col>
      </Row>
      <Link to="/bb/mine" className="btn btn-primary mt-1 mb-4">
        My Posts
      </Link>
      <Link to="/bb/create" className="btn btn-primary mx-2 mt-1 mb-4">
        Create Post
      </Link>
      <Gallery>
        {" "}
        {/* Wrap with Gallery component */}
        {posts.map((post) => (
          <div key={post._id}>
            <hr />
            <Row className="my-2 text-center">
              <Col md={1}>
                {post.image && (
                  <Item
                    original={post.image} // Full-size image
                    thumbnail={post.thumbnail} // Thumbnail image
                    width="1600" // You can adjust based on the full-size image dimensions
                    height="900"
                    title={post.title}
                  >
                    {({ ref, open }) => (
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        width={100}
                        style={{ cursor: "pointer" }}
                        ref={ref} // Reference for the Item
                        onClick={open} // Open lightbox when clicked
                      />
                    )}
                  </Item>
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
      </Gallery>{" "}
      {/* End Gallery */}
    </Container>
  );
};

export default BulletinBoard;
