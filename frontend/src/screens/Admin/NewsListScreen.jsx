import { useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import { FaTrash, FaTimes, FaEdit, FaCheck } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useGetAllNewsQuery,
  useDeleteNewsMutation,
} from "../../slices/newsApiSlice";

const NewsListScreen = () => {
  const { data: news, refetch, isLoading, error } = useGetAllNewsQuery();
  const [deleteNews, { isLoading: loadingDelete }] = useDeleteNewsMutation();
  const [showPublished, setShowPublished] = useState(true);

  const togglePublished = () => {
    setShowPublished(!showPublished);
  };

  const filteredNews = showPublished
    ? news
    : news.filter((newsItem) => !newsItem.isPublished);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this news post?")) {
      try {
        await deleteNews(id);
        toast.success("News deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Container className="mt-4 form-background">
      <Row className="align-items-center">
        <Col>
          <Link to="/" className="btn btn-primary my-3">
            Go Back
          </Link>
        </Col>
        <Col>
          <h1>News</h1>
        </Col>
        <Col className="text-end">
          <Link to="/admin/news/create" className="btn btn-primary my-3">
            <FaEdit /> Create Post
          </Link>{" "}
          <Button variant="primary" onClick={togglePublished} className="my-3">
            {showPublished ? "Hide Published Posts" : "Show Published Posts"}
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>TITLE</th>
              <th>DATE</th>
              <th>AUTHOR</th>
              <th>PUBLISHED?</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredNews.map((newsItem) => (
              <tr key={newsItem._id}>
                <td>
                  {newsItem.title.length > 50
                    ? newsItem.title.substring(0, 50) + "..."
                    : newsItem.title}
                </td>
                <td>{newsItem.updatedAt.substring(0, 10)}</td>
                <td>{newsItem.user.name}</td>
                <td>
                  {newsItem.isPublished ? (
                    <FaCheck style={{ color: "green" }} />
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/news/${newsItem._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(newsItem._id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};
export default NewsListScreen;
