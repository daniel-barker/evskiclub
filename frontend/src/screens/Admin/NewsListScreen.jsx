import { useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Table, Button, Container, Row, Col, Form } from "react-bootstrap";
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

  const [titleFilter, setTitleFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [publishedFilter, setPublishedFilter] = useState(""); // "" for all, "yes" for published, "no" for unpublished

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

  // Filter news items based on title, author, and published status
  const filteredNews = news?.filter(
    (newsItem) =>
      newsItem.title.toLowerCase().includes(titleFilter.toLowerCase()) &&
      (newsItem.user?.name.toLowerCase().includes(authorFilter.toLowerCase()) ||
        "Unknown Author".toLowerCase().includes(authorFilter.toLowerCase())) &&
      (publishedFilter === "" ||
        (publishedFilter === "yes" && newsItem.isPublished) ||
        (publishedFilter === "no" && !newsItem.isPublished))
  );

  return (
    <Container className="mt-4 form-background">
      <Row className="align-items-center">
        <Col>
          <h1>News</h1>
        </Col>
        <Col xs="auto" className="text-end">
          <Link to="/admin/news/create" className="btn btn-primary">
            Create Post
          </Link>
        </Col>
      </Row>

      {/* Filter Controls */}
      <Row className="my-3">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Filter by Title"
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Filter by Author"
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Select
            value={publishedFilter}
            onChange={(e) => setPublishedFilter(e.target.value)}
          >
            <option value="">All Published Status</option>
            <option value="yes">Published</option>
            <option value="no">Unpublished</option>
          </Form.Select>
        </Col>
      </Row>

      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table
          striped
          hover
          responsive
          className="table-sm text-center mx-auto"
        >
          <thead>
            <tr>
              <th className="fs-5">TITLE</th>
              <th className="fs-5">DATE</th>
              <th className="fs-5">AUTHOR</th>
              <th className="fs-5">PUBLISHED?</th>
              <th className="fs-5"></th>
            </tr>
          </thead>
          <tbody>
            {filteredNews.map((newsItem) => (
              <tr key={newsItem._id}>
                <td className="align-middle fs-5">
                  {newsItem.title.length > 50
                    ? newsItem.title.substring(0, 50) + "..."
                    : newsItem.title}
                </td>
                <td className="align-middle fs-5">
                  {newsItem.updatedAt.substring(0, 10)}
                </td>
                <td className="align-middle fs-5">
                  {newsItem.user ? newsItem.user.name : "Unknown Author"}
                </td>
                <td className="align-middle fs-5">
                  {newsItem.isPublished ? (
                    <FaCheck style={{ color: "green" }} />
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td className="align-middle fs-5">
                  <LinkContainer to={`/admin/news/${newsItem._id}/edit`}>
                    <Button className="me-3">Edit</Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    onClick={() => deleteHandler(newsItem._id)}
                  >
                    Delete
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
