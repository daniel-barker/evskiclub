import { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useGetAllUnitsQuery } from "../slices/unitApiSlice";

const MemberDirectory = () => {
  const { data: units, isLoading, error } = useGetAllUnitsQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = units ? Math.ceil(units.length / itemsPerPage) : 1;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUnits = units?.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container>
      <Link to="/" className="btn btn-primary my-3">
        Go Back
      </Link>
      <Row className="align-items-center pt-2 pb-5">
        <Col className="text-center">
          <h1>Membership Directory</h1>
        </Col>
      </Row>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || "Failed to fetch units"}
        </Message>
      ) : (
        <>
          {currentUnits.map((unit) => (
            <Card key={unit._id} className="my-3 p-3 rounded shadow-sm">
              <Row>
                <Col sm={12} md={6} lg={4} xl={3}>
                  <Card.Img src={unit.image} />
                  <h3>Member Since: {`${unit.memberSince}`}</h3>
                </Col>
                <Col>
                  <Row>
                    <Col>
                      {unit.members.map((member) => (
                        <div key={member._id}>
                          <h3>{`${member.firstName} ${member.lastName}`}</h3>
                          <p>E-Mail: {member.email}</p>
                          {member.phoneNumber.map((phone) => (
                            <p
                              key={phone._id}
                            >{`${phone.type}: ${phone.number}`}</p>
                          ))}
                        </div>
                      ))}
                    </Col>
                    <Col>
                      {unit.addresses.map((address) => (
                        <div key={address._id}>
                          <h3>{`${address.addressType} Address`}</h3>
                          <p>{`${address.street}`}</p>
                          <p>{`${address.city}, ${address.state} ${address.zip}`}</p>
                        </div>
                      ))}
                    </Col>
                  </Row>
                  <br />
                  <br />
                  <Row>
                    <h5 className="text-center">{`${unit.bio}`}</h5>
                  </Row>
                </Col>
              </Row>
            </Card>
          ))}

          <div className="d-flex justify-content-center">
            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                disabled={currentPage === index + 1}
                className="mx-1"
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </>
      )}
    </Container>
  );
};

export default MemberDirectory;
