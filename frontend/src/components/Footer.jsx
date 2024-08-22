import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#001f3f", padding: "10px 0" }}>
      <Container>
        <Row>
          <Col className="text-center">
            <h5 style={{ color: "#fff" }}>Follow Us</h5>
            <p style={{ color: "#ccc" }}>
              Stay connected through our social media channels.
            </p>
            <ul className="list-inline">
              <li className="list-inline-item">
                <a
                  href="https://facebook.com"
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  <i className="fab fa-facebook-f"></i> Facebook
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  href="https://twitter.com"
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  <i className="fab fa-twitter"></i> Twitter
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  href="https://instagram.com"
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  <i className="fab fa-instagram"></i> Instagram
                </a>
              </li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Col className="text-center mt-3">
            <p style={{ color: "#ccc", marginBottom: 0 }}>
              &copy; {new Date().getFullYear()} Ellicottville Ski Club. All
              rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
