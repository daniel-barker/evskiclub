import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import { FaTrash, FaEdit } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useGetAllUnitsQuery,
  useDeleteUnitMutation,
} from "../../slices/unitApiSlice";

const MemberListScreen = () => {
  const {
    data: units,
    refetch,
    isLoading,
    isError,
    error,
  } = useGetAllUnitsQuery();
  const [deleteUnit, { isLoading: isDeleting }] = useDeleteUnitMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this member unit?")) {
      try {
        await deleteUnit(id).unwrap();
        toast.success("Member unit deleted successfully");
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
          <h1>Membership Directory</h1>
        </Col>
        <Col className="text-end">
          <Link to="/admin/members/create" className="btn btn-primary my-3">
            <FaEdit /> Add Member to Directory
          </Link>
        </Col>
      </Row>
      {isLoading || isDeleting ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {error?.data?.message || "Failed to fetch units"}
        </Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>Members</th>
              <th>Emails</th>
              <th>Phone Numbers</th>
              <th>Addresses</th>
              <th>Member Since</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {units?.map((unit) => (
              <tr key={unit._id}>
                <td className="nowrap-on-desktop">
                  {unit.members.map((member, index) => (
                    <div key={index}>
                      {`${member.firstName} ${member.lastName}`}
                      <br />
                    </div>
                  ))}
                </td>
                <td>
                  {unit.members.map((member, index) => (
                    <div key={index}>
                      {member.email || "No Email Entered"}
                      <br />
                    </div>
                  ))}
                </td>
                <td className="nowrap-on-desktop">
                  {unit.members.map((member, index) => (
                    <React.Fragment key={index}>
                      {/* Sorting and mapping phone numbers */}
                      {member.phoneNumber
                        .slice() // Make a shallow copy to avoid mutating the original array
                        .sort((a, b) => {
                          if (a.type === "cell") return -1;
                          if (b.type === "cell") return 1;
                          if (a.type === "home") return 1;
                          if (b.type === "home") return -1;
                          return 0;
                        })
                        .map((phone, phoneIndex) => (
                          <React.Fragment key={phoneIndex}>
                            <span>{`${phone.type}: ${phone.number}`}</span>
                            <br />
                          </React.Fragment>
                        ))}
                    </React.Fragment>
                  ))}
                </td>
                <td>
                  {unit.addresses.map((address, index) => (
                    <div key={index}>
                      {address.addressType === "primary" ? "P: " : "S: "}
                      {`${address.street}, ${address.city}, ${address.state} ${address.zip}`}
                      <br />
                    </div>
                  ))}
                </td>
                <td>{unit.memberSince}</td>
                <td>
                  <LinkContainer to={`/admin/members/${unit._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <FaEdit />
                    </Button>
                  </LinkContainer>{" "}
                  <Button
                    variant="light"
                    className="btn-sm"
                    onClick={() => deleteHandler(unit._id)}
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
