import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useGetAllPostsQuery,
  useDeletePostAsAdminMutation,
} from "../../slices/postApiSlice";

const BBListScreen = () => {
  const { data: posts, refetch, isLoading, error } = useGetAllPostsQuery();
  const [deletePost, { isLoading: loadingDelete }] =
    useDeletePostAsAdminMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete a post?")) {
      try {
        await deletePost(id);
        toast.success("Post deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Container>
      <Row className="align-items-center pt-4">
        <Col>
          <h1>Bulletin Board</h1>
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
              <th>POST</th>
              <th>CREATED ON</th>
              <th>CREATED BY</th>
              <th>STATUS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id}>
                <td>{post.title}</td>
                <td>{post.createdAt.substring(0, 10)}</td>
                <td>{post.user.name}</td>
                <td>{post.status}</td>
                <td>
                  <LinkContainer to={`/admin/bb/${post._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      Edit
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(post._id)}
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
export default BBListScreen;
