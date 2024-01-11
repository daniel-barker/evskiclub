import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import { FaTrash, FaTimes, FaEdit, FaCheck, FaNewspaper } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useGetAllMembersQuery,
  useDeleteMemberMutation,
} from "../../slices/memberApiSlice.js";

const MemberListScreen = () => {
  const { data: members, refetch, isLoading, error } = useGetAllMembersQuery();

  const [deleteMember, { isLoading: loadingDelete }] =
    useDeleteMemberMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete a member?")) {
      try {
        await deleteMember(id);
        toast.success("Member deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Container className="mt-4">
      <Row className="align-items-center">
        <Col>
          <Link to="/" className="btn btn-secondary my-3">
            Go Back
          </Link>
        </Col>
        <Col>
          <h1>Members</h1>
        </Col>
        <Col className="text-end">
          <Link to="/admin/member/create" className="btn btn-secondary my-3">
            <FaEdit /> Create Member
          </Link>
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
              <th>NAME</th>
              <th>EMAIL</th>
              <th>PHONE</th>
              <th>PICTURE</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {members?.map((member) => (
              <tr key={member._id}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.phone}</td>
                <td>
                  <img
                    src={member.picture}
                    alt={member.name}
                    className="img-fluid"
                    style={{ width: "100px" }}
                  />
                </td>
                <td>
                  <LinkContainer to={`/admin/member/${member._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(member._id)}
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
export default MemberListScreen;
