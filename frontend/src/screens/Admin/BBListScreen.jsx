import React, { useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Container, Row, Col, Form } from "react-bootstrap";
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

  const [postFilter, setPostFilter] = useState("");
  const [createdByFilter, setCreatedByFilter] = useState("");

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

  // Filter posts based on the post title and created by filters
  const filteredPosts = posts?.filter(
    (post) =>
      post.title.toLowerCase().includes(postFilter.toLowerCase()) &&
      post.user.name.toLowerCase().includes(createdByFilter.toLowerCase())
  );

  return (
    <Container className="mt-4 form-background">
      <Row className="align-items-center">
        <Col>
          <h1>Bulletin Board</h1>
        </Col>
      </Row>

      {/* Filter Controls */}
      <Row className="my-3">
        <Col md={5}>
          <Form.Control
            type="text"
            placeholder="Filter by Post Name"
            value={postFilter}
            onChange={(e) => setPostFilter(e.target.value)}
          />
        </Col>
        <Col md={5}>
          <Form.Control
            type="text"
            placeholder="Filter by Created By"
            value={createdByFilter}
            onChange={(e) => setCreatedByFilter(e.target.value)}
          />
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
              <th className="fs-5">POST</th>
              <th className="fs-5">CREATED ON</th>
              <th className="fs-5">CREATED BY</th>
              <th className="fs-5">STATUS</th>
              <th className="fs-5"></th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => (
              <tr key={post._id}>
                <td className="align-middle fs-5">{post.title}</td>
                <td className="align-middle fs-5">
                  {post.createdAt.substring(0, 10)}
                </td>
                <td className="align-middle fs-5">{post.user.name}</td>
                <td className="align-middle fs-5">{post.status}</td>
                <td className="align-middle fs-5">
                  <LinkContainer to={`/admin/bb/${post._id}/edit`}>
                    <Button className="me-3">Edit</Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    onClick={() => deleteHandler(post._id)}
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

export default BBListScreen;
