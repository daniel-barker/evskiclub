import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useGetAllUnitsQuery } from "../slices/unitApiSlice";

const MemberDirectory = () => {
  const { data: units, isLoading, error } = useGetAllUnitsQuery();
  console.log(units);

  return (
    <Container className="mt-4 form-background">
      <Row className="align-items-center pt-2pb-5">
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
        <Row>
          {units.map((unit) => (
            <Card className="my-3 p-3 rounded">
              <Col key={unit._id} sm={12} md={6} lg={4} xl={3}>
                {unit.members.map((member, index) => (
                  <div key={index}>
                    <h3>{`${member.firstName} ${member.lastName}`}</h3>
                    <p>{member.email}</p>
                    {member.phoneNumber.map((phone, index) => (
                      <p key={index}>{`${phone.type}: ${phone.number}`}</p>
                    ))}
                  </div>
                ))}
                <Card.Img src={unit.image} variant="top" />
                <Card.Body>
                  <Card.Title as="div">
                    <strong>{unit.members.firstName}</strong>
                  </Card.Title>

                  <Card.Text as="div">
                    <div className="my-3"></div>
                    <div className="my-3"></div>
                  </Card.Text>
                </Card.Body>
              </Col>
            </Card>
          ))}
        </Row>
      )}
    </Container>
  );
};
export default MemberDirectory;
