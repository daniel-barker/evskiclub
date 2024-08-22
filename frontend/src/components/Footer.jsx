import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const excludedHeaderPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  if (excludedHeaderPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <footer style={{ backgroundColor: "#001f3f", padding: "20px 0" }}>
      <Container>
        <Row>
          <Col md={4} className="text-center text-md-start mb-3 mb-md-0">
            <h5 style={{ color: "#fff" }}>Quick Links</h5>
            <ul className="list-unstyled" style={{ color: "#ccc" }}>
              <li>
                <a
                  href="/about"
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/events"
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  Events
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  Contact
                </a>
              </li>
            </ul>
          </Col>
          <Col md={8} className="text-center">
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
          <Col className="text-center text-md-start mt-3">
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
