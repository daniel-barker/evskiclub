import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const FormContainer = ({ children }) => {
  return (
    <Container className="mt-3">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <div className="form-background">{children}</div>
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;
