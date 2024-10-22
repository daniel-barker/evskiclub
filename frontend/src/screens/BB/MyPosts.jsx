import { useState } from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  useGetMyPostsQuery,
  useDeletePostAsUserMutation,
} from "../../slices/postApiSlice";
import DOMPurify from "dompurify";

const MyPosts = () => {
  const { data: posts, refetch, isLoading, isError } = useGetMyPostsQuery();
  const [deletePost, { isLoading: loadingDelete }] =
    useDeletePostAsUserMutation();
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

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(id);
        toast.success("Post deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
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
      <Row className="align-items-center mt-5 pb-5">
        <Col>
          <h1 className="text-center">My Posts</h1>
        </Col>
      </Row>
      <Link to="/bb" className="btn btn-primary mt-1 mb-4">
        All Posts
      </Link>
      <Link to="/bb/create" className="btn btn-primary mx-2 mt-1 mb-4">
        Create Post
      </Link>
      {visiblePosts.length === 0 ? (
        <p className="text-center">
          <h3>
            You haven't made a post yet. Click Create Post to get started!
          </h3>
        </p>
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
              <Col md={10}>
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
              <Col md={1}>
                {/* Edit Button */}
                <Link to={`/bb/edit/${post._id}`}>
                  <Button variant="warning" className="btn-sm mb-2">
                    <FaEdit /> Edit
                  </Button>
                </Link>
                {/* Delete Button */}
                <Button
                  variant="danger"
                  className="btn-sm"
                  onClick={() => deleteHandler(post._id)}
                  disabled={loadingDelete}
                >
                  Delete
                </Button>
              </Col>
            </Row>
          </div>
        ))
      )}
    </Container>
  );
};

export default MyPosts;
