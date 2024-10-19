import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetLatestPostsQuery } from "../slices/postApiSlice";
import DOMPurify from "dompurify";

const LatestPosts = () => {
  const { data: posts, isLoading, isError } = useGetLatestPostsQuery();

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

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching posts</p>;

  return (
    <Card className="bulletin-board-card">
      <Card.Header className="bulletin-board-card-header">
        Latest Bulletin Board Posts
      </Card.Header>
      <Card.Body className="latest-posts-card-body">
        {posts.map((post) => (
          <div key={post._id} className="bulletin-post">
            <Card.Title className="bulletin-post-title mt-2">
              {post.title}
            </Card.Title>
            <div className="bulletin-post-user">
              Posted by: {post.user?.name}
            </div>
            <div
              className="bulletin-post-content"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.body),
              }}
            />
            <div className="bulletin-post-date">
              {formatDate(post.createdAt)}
            </div>
          </div>
        ))}
      </Card.Body>
      <Card.Footer className="text-center">
        <Link to="/bb" className="btn btn-outline-primary">
          See Details and Older Posts
        </Link>
      </Card.Footer>
    </Card>
  );
};

export default LatestPosts;
