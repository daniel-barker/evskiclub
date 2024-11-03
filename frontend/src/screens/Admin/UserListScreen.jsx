import React, { useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Container, Row, Col, Form } from "react-bootstrap";
import { FaTrash, FaTimes, FaEdit, FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../slices/usersApiSlice";

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete a user?")) {
      try {
        await deleteUser(id);
        toast.success("User deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  // Filter users based on the name and email filter input
  const filteredUsers = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      user.email.toLowerCase().includes(emailFilter.toLowerCase())
  );

  return (
    <Container className="mt-4 form-background">
      <Row className="align-items-center">
        <Col>
          <h1>Users</h1>
        </Col>
      </Row>

      {/* Filter Controls */}
      <Row className="my-3">
        <Col md={5}>
          <Form.Control
            type="text"
            placeholder="Filter by Name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </Col>
        <Col md={5}>
          <Form.Control
            type="text"
            placeholder="Filter by Email"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
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
              <th className="fs-5">NAME</th>
              <th className="fs-5">EMAIL</th>
              <th className="fs-5">ADMIN</th>
              <th className="fs-5">STATUS</th>
              <th className="fs-5"></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td className="align-middle fs-5">{user.name}</td>
                <td className="align-middle fs-5">
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td className="align-middle fs-5">
                  {user.isAdmin ? (
                    <FaCheck style={{ color: "green" }} />
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td className="align-middle fs-5">
                  {user.isApproved ? (
                    <FaCheck style={{ color: "green" }} />
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td className="align-middle fs-5">
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button className="me-3">Edit</Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    onClick={() => deleteHandler(user._id)}
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

export default UserListScreen;
