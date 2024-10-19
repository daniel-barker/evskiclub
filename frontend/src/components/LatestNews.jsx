import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetLatestNewsQuery } from "../slices/newsApiSlice";
import DOMPurify from "dompurify";

const LatestNews = () => {
  const { data: news, isLoading, isError } = useGetLatestNewsQuery();

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
    <Card className="home-news-card">
      <Card.Header className="home-news-card-header">Latest News</Card.Header>
      <Card.Body>
        {news.map((newsPost) => (
          <div key={newsPost._id} className="home-news-post d-flex">
            <div className="home-news-post-content">
              <Card.Title className="home-news-post-title">
                {newsPost.title}
              </Card.Title>
              <div className="home-news-post-user">
                By: {newsPost.user?.name}
              </div>
              <div
                className="home-news-post-text fs-5"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(newsPost.post),
                }}
              />
              <div className="home-news-post-date">
                {formatDate(newsPost.createdAt)}
              </div>
            </div>
            {newsPost.image && (
              <div className="home-news-post-image-container">
                <img
                  src={newsPost.image}
                  alt="News post"
                  className="home-news-post-image"
                />
              </div>
            )}
          </div>
        ))}
      </Card.Body>
      <Card.Footer className="text-center">
        <Link to="/news" className="btn btn-outline-primary">
          See More News
        </Link>
      </Card.Footer>
    </Card>
  );
};

export default LatestNews;
