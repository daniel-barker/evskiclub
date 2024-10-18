import { Underline } from "ckeditor5";
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
    <footer>
      <Container>
        <Row>
          <Col className="text-center mt-1">
            <h5 style={{ color: "#fff", textDecoration: "Underline" }}>
              Links
            </h5>
            <ul className="list-inline footer-links">
              <li className="list-inline-item">
                <a
                  href="https://www.ellicottvilleny.com/"
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  Chamber Website
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  href="https://www.facebook.com/holidayvalley"
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  Holiday Valley Facebook
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  href="https://www.holidayvalley.com/"
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  <i className="fab fa-instagram"></i> Holiday Valley Resort
                </a>
              </li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Col className="text-center my-3">
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
