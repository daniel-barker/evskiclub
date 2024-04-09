import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useGetAllUnitsQuery } from "../slices/unitApiSlice";

const MemberDirectory = () => {
  const { data: units, isLoading, error } = useGetAllUnitsQuery();

  return (
    <Container className="mt-4">
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
        units.map((unit) => (
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
        ))
      )}
    </Container>
  );
};
export default MemberDirectory;
