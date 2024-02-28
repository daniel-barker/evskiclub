import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const CreateContainer = ({ children }) => {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={8}>
          <div className="form-background p-5">{children}</div>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateContainer;
