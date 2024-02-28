import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetLatestNewsQuery } from "../slices/newsApiSlice";

const LatestNews = () => {
  const { data: news, isLoading, isError } = useGetLatestNewsQuery();

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

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
  if (isError) return <p>Error fetching news</p>;

  return (
    <div>
      <Card style={{ backgroundColor: "#f5f5f5" }}>
        <div className="news-card-header d-flex justify-content-between align-items-center">
          <div className="news-card-title">Latest news</div>
          <Link to="/news" className="btn btn-primary">
            Previous Posts
          </Link>
        </div>
        {news.map((newsPost) => (
          <div key={newsPost._id}>
            <Card.Title className="news-post-title text-center">
              {newsPost.title}
            </Card.Title>
            <Card.Body>{truncateText(newsPost.post, 500)}</Card.Body>
            <Card.Footer className="ms-auto">
              <div className="news-card-signature">
                {newsPost.user && newsPost.user.name}
              </div>
              <div className="news-card-sig-position">
                {newsPost.user && newsPost.user.position}
              </div>
              <div className="news-card-sig-position">
                {formatDate(newsPost.createdAt)}
              </div>
            </Card.Footer>
          </div>
        ))}
      </Card>
    </div>
  );
};
export default LatestNews;
